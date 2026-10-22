/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/stripe/client", () => ({
  stripe: {
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
      cancel: vi.fn(),
    },
    accounts: { create: vi.fn() },
    accountLinks: { create: vi.fn() },
    refunds: { create: vi.fn() },
    transfers: { create: vi.fn() },
  },
}));
vi.mock("@/server/emails", () => ({ sendEmail: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock("@/server/db", () => ({ db: {} }));

import { depositsRouter } from "@/server/trpc/routers/deposits";
import { createCallerFactory } from "@/server/trpc/index";
import { stripe } from "@/server/stripe/client";
import { createMockDb, type MockDb } from "../utils/mock-db";

const createCaller = createCallerFactory(depositsRouter);

function makeCtx(userId: string, db: MockDb) {
  return {
    db: db as any,
    session: {
      user: { id: userId, name: "Test User", email: "test@test.com" },
      session: { id: "sess-1", userId, expiresAt: new Date(Date.now() + 86400000) },
    },
    req: {} as any,
  } as any;
}

const USER_ID = "user-man-1";
const TARGET_ID = "user-woman-1";
const REQUEST_ID = "req-1";

const baseRequest = {
  id: REQUEST_ID,
  requesterId: USER_ID,
  targetId: TARGET_ID,
  status: "pending" as const,
  target: {
    id: TARGET_ID,
    profile: { depositAmount: 5000 },
  },
};

describe("depositsRouter.createPaymentIntent", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN if request not found", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(null);
    const caller = createCaller(makeCtx(USER_ID, db));

    await expect(caller.createPaymentIntent({ dateRequestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("throws FORBIDDEN if caller is not the requester", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      requesterId: "someone-else",
    });
    const caller = createCaller(makeCtx(USER_ID, db));

    await expect(caller.createPaymentIntent({ dateRequestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("throws BAD_REQUEST if request status is not pending", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "paid",
    });
    const caller = createCaller(makeCtx(USER_ID, db));

    await expect(caller.createPaymentIntent({ dateRequestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "BAD_REQUEST" })
    );
  });

  it("returns existing clientSecret if deposit already exists (StrictMode fix)", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    db.query.deposits.findFirst.mockResolvedValue({
      id: "dep-1",
      stripePaymentIntentId: "pi_existing",
      status: "pending",
    });
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      client_secret: "cs_existing_secret",
    } as any);

    const caller = createCaller(makeCtx(USER_ID, db));
    const result = await caller.createPaymentIntent({ dateRequestId: REQUEST_ID });

    expect(result).toEqual({ clientSecret: "cs_existing_secret" });
    expect(stripe.paymentIntents.create).not.toHaveBeenCalled();
  });

  it("creates new PaymentIntent and deposit in the happy path", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    db.query.deposits.findFirst.mockResolvedValue(null);
    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_new",
      client_secret: "cs_new_secret",
    } as any);

    const caller = createCaller(makeCtx(USER_ID, db));
    const result = await caller.createPaymentIntent({ dateRequestId: REQUEST_ID });

    expect(result).toEqual({ clientSecret: "cs_new_secret" });
    expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 5000,
        currency: "usd",
        metadata: expect.objectContaining({ dateRequestId: REQUEST_ID }),
      })
    );
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("handles race condition: cancels new PI and returns existing one", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    // First call: no existing deposit; second call: deposit created by concurrent request
    db.query.deposits.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "dep-race", stripePaymentIntentId: "pi_race" });

    vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
      id: "pi_duplicate",
      client_secret: "cs_dup",
    } as any);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      client_secret: "cs_race_secret",
    } as any);

    // Simulate unique constraint failure on insert
    db.insert.mockReturnValue({
      values: vi.fn().mockRejectedValue(new Error("unique constraint")),
    });

    const caller = createCaller(makeCtx(USER_ID, db));
    const result = await caller.createPaymentIntent({ dateRequestId: REQUEST_ID });

    expect(stripe.paymentIntents.cancel).toHaveBeenCalledWith("pi_duplicate");
    expect(result).toEqual({ clientSecret: "cs_race_secret" });
  });
});

describe("depositsRouter.createConnectedAccount", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN if user is a man", async () => {
    db.query.users.findFirst.mockResolvedValue({ id: USER_ID, gender: "man" });
    const caller = createCaller(makeCtx(USER_ID, db));

    await expect(caller.createConnectedAccount()).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("creates a Stripe Express account for a woman with no existing account", async () => {
    db.query.users.findFirst.mockResolvedValue({
      id: TARGET_ID,
      gender: "woman",
      email: "woman@test.com",
      stripeAccountId: null,
    });
    vi.mocked(stripe.accounts.create).mockResolvedValue({ id: "acct_new" } as any);
    vi.mocked(stripe.accountLinks.create).mockResolvedValue({ url: "https://stripe.com/onboarding" } as any);

    const caller = createCaller(makeCtx(TARGET_ID, db));
    const result = await caller.createConnectedAccount();

    expect(result).toEqual({ url: "https://stripe.com/onboarding" });
    expect(stripe.accounts.create).toHaveBeenCalledTimes(1);
  });
});
