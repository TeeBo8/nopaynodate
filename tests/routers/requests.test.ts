/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/stripe/client", () => ({
  stripe: {
    paymentIntents: { retrieve: vi.fn(), create: vi.fn(), cancel: vi.fn() },
    refunds: { create: vi.fn() },
    transfers: { create: vi.fn() },
  },
}));
vi.mock("@/server/emails", () => ({ sendEmail: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock("@/server/db", () => ({ db: {} }));

import { requestsRouter } from "@/server/trpc/routers/requests";
import { createCallerFactory } from "@/server/trpc/index";
import { stripe } from "@/server/stripe/client";
import { sendEmail } from "@/server/emails";
import { createMockDb, type MockDb } from "../utils/mock-db";

const createCaller = createCallerFactory(requestsRouter);

function makeCtx(userId: string, db: MockDb) {
  return {
    db: db as any,
    session: {
      user: { id: userId, name: "Test", email: "test@test.com" },
      session: { id: "sess-1", userId, expiresAt: new Date(Date.now() + 86400000) },
    },
    req: {} as any,
  };
}

const MAN_ID = "man-1";
const WOMAN_ID = "woman-1";
const REQUEST_ID = "req-1";
const DEPOSIT_ID = "dep-1";

const baseRequest = {
  id: REQUEST_ID,
  requesterId: MAN_ID,
  targetId: WOMAN_ID,
  status: "paid" as const,
  requesterConfirmed: false,
  targetConfirmed: false,
  deposit: {
    id: DEPOSIT_ID,
    stripePaymentIntentId: "pi_test",
    netAmount: 4500,
    status: "held",
  },
};

// ─── send ─────────────────────────────────────────────────────────────────────

describe("requestsRouter.send", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN if caller is not a man", async () => {
    db.query.users.findFirst.mockResolvedValue({ id: WOMAN_ID, gender: "woman" });
    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.send({ targetId: MAN_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("returns existing request if an active one already exists", async () => {
    db.query.users.findFirst
      .mockResolvedValueOnce({ id: MAN_ID, gender: "man" })     // requester
      .mockResolvedValueOnce({ id: WOMAN_ID, gender: "woman" }); // target
    db.query.profiles.findFirst.mockResolvedValue({ userId: WOMAN_ID });
    db.query.dateRequests.findFirst.mockResolvedValue({ id: "existing-req" });

    const caller = createCaller(makeCtx(MAN_ID, db));
    const result = await caller.send({ targetId: WOMAN_ID });

    expect(result).toEqual({ id: "existing-req" });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("creates a new request in the happy path", async () => {
    db.query.users.findFirst
      .mockResolvedValueOnce({ id: MAN_ID, gender: "man" })     // requester
      .mockResolvedValueOnce({ id: WOMAN_ID, gender: "woman" }); // target
    db.query.profiles.findFirst.mockResolvedValue({ userId: WOMAN_ID });
    db.query.dateRequests.findFirst.mockResolvedValue(null);

    const caller = createCaller(makeCtx(MAN_ID, db));
    const result = await caller.send({ targetId: WOMAN_ID });

    expect(result).toHaveProperty("id");
    expect(db.insert).toHaveBeenCalledTimes(1);
  });
});

// ─── accept ───────────────────────────────────────────────────────────────────

describe("requestsRouter.accept", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN if caller is not the target", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      targetId: "someone-else",
    });
    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.accept({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("throws BAD_REQUEST if deposit is not yet paid", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "pending",
    });
    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.accept({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "BAD_REQUEST" })
    );
  });

  it("throws PRECONDITION_FAILED if woman has no Stripe account", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    db.query.users.findFirst.mockResolvedValue({ id: WOMAN_ID, stripeAccountId: null });

    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.accept({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "PRECONDITION_FAILED" })
    );
  });

  it("sets request to accepted and sends email in the happy path", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    db.query.users.findFirst
      .mockResolvedValueOnce({ id: WOMAN_ID, stripeAccountId: "acct_test" }) // currentUser check
      .mockResolvedValueOnce({ id: MAN_ID, email: "man@test.com", name: "John" }) // requester for email
      .mockResolvedValueOnce({ id: WOMAN_ID, email: "woman@test.com", name: "Jane" }); // target for email

    const caller = createCaller(makeCtx(WOMAN_ID, db));
    const result = await caller.accept({ requestId: REQUEST_ID });

    expect(result).toEqual({ success: true });
    expect(db.update).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(1);
  });
});

// ─── reject ───────────────────────────────────────────────────────────────────

describe("requestsRouter.reject", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws FORBIDDEN if caller is not the target", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      targetId: "someone-else",
    });
    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.reject({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("throws BAD_REQUEST for invalid status (pending)", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "pending",
    });
    const caller = createCaller(makeCtx(WOMAN_ID, db));

    await expect(caller.reject({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "BAD_REQUEST" })
    );
  });

  it("refunds the deposit and sets request to rejected", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(baseRequest);
    vi.mocked(stripe.refunds.create).mockResolvedValue({ id: "re_test" } as any);

    const caller = createCaller(makeCtx(WOMAN_ID, db));
    const result = await caller.reject({ requestId: REQUEST_ID });

    expect(result).toEqual({ success: true });
    expect(stripe.refunds.create).toHaveBeenCalledWith(
      expect.objectContaining({ payment_intent: "pi_test" })
    );
    // 2 updates: deposit → refunded, request → rejected
    expect(db.update).toHaveBeenCalledTimes(2);
  });
});

// ─── confirm ──────────────────────────────────────────────────────────────────

describe("requestsRouter.confirm", () => {
  let db: MockDb;

  beforeEach(() => {
    db = createMockDb();
    vi.clearAllMocks();
  });

  it("throws NOT_FOUND if request does not exist", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(null);
    const caller = createCaller(makeCtx(MAN_ID, db));

    await expect(caller.confirm({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "NOT_FOUND" })
    );
  });

  it("throws FORBIDDEN if caller is unrelated to the request", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "accepted",
      requesterId: "other-man",
      targetId: "other-woman",
    });
    const caller = createCaller(makeCtx(MAN_ID, db));

    await expect(caller.confirm({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "FORBIDDEN" })
    );
  });

  it("throws BAD_REQUEST if status is not accepted", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "paid",
    });
    const caller = createCaller(makeCtx(MAN_ID, db));

    await expect(caller.confirm({ requestId: REQUEST_ID })).rejects.toThrow(
      expect.objectContaining({ code: "BAD_REQUEST" })
    );
  });

  it("sets requesterConfirmed but does NOT release funds (only one side confirmed)", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "accepted",
      requesterConfirmed: false,
      targetConfirmed: false, // target not yet confirmed
    });

    const caller = createCaller(makeCtx(MAN_ID, db));
    const result = await caller.confirm({ requestId: REQUEST_ID });

    expect(result).toEqual({ success: true });
    expect(stripe.transfers.create).not.toHaveBeenCalled();
    expect(db.update).toHaveBeenCalledTimes(1);
  });

  it("releases funds and completes request when both parties confirm", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({
      ...baseRequest,
      status: "accepted",
      requesterConfirmed: false,
      targetConfirmed: true, // target already confirmed
    });
    db.query.users.findFirst.mockResolvedValue({
      id: WOMAN_ID,
      email: "woman@test.com",
      name: "Jane",
      stripeAccountId: "acct_test",
    });
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({
      latest_charge: "ch_test",
    } as any);
    vi.mocked(stripe.transfers.create).mockResolvedValue({ id: "tr_test" } as any);

    const caller = createCaller(makeCtx(MAN_ID, db));
    const result = await caller.confirm({ requestId: REQUEST_ID });

    expect(result).toEqual({ success: true });
    expect(stripe.transfers.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 4500,
        currency: "usd",
        destination: "acct_test",
      }),
      { idempotencyKey: `release-${DEPOSIT_ID}` }
    );
    // 3 updates: requesterConfirmed, deposit → released, request → completed
    expect(db.update).toHaveBeenCalledTimes(3);
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(1);
  });
});
