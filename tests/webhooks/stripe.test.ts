/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoist db mock so it's available inside vi.mock() factory
const mockDb = vi.hoisted(() => {
  const where = vi.fn().mockResolvedValue([]);
  const set = vi.fn().mockReturnValue({ where });
  const update = vi.fn().mockReturnValue({ set });
  const values = vi.fn().mockResolvedValue([]);
  const insert = vi.fn().mockReturnValue({ values });
  return {
    update,
    insert,
    query: {
      deposits: { findFirst: vi.fn() },
      dateRequests: { findFirst: vi.fn() },
      users: { findFirst: vi.fn() },
      subscriptions: { findFirst: vi.fn() },
    },
  };
});

vi.mock("@/server/db", () => ({ db: mockDb }));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: (key: string) => (key === "stripe-signature" ? "test-sig" : null),
  }),
}));
vi.mock("@/server/stripe/client", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    paymentIntents: { retrieve: vi.fn() },
    refunds: { create: vi.fn() },
    transfers: { create: vi.fn() },
  },
}));
vi.mock("@/server/emails", () => ({ sendEmail: vi.fn() }));

import { POST } from "@/app/api/webhooks/stripe/route";
import { stripe } from "@/server/stripe/client";
import { sendEmail } from "@/server/emails";

function makeRequest(body = "raw-body") {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body,
  });
}

function mockEvent(type: string, object: Record<string, unknown>) {
  vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
    type,
    data: { object },
  } as any);
}

describe("Stripe webhook — signature validation", () => {
  it("returns 400 when stripe-signature header is missing", async () => {
    const { headers } = await import("next/headers");
    vi.mocked(headers).mockResolvedValueOnce({
      get: () => null,
    } as any);

    const response = await POST(makeRequest());
    expect(response.status).toBe(400);
  });

  it("returns 400 when signature is invalid", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementationOnce(() => {
      throw new Error("Invalid signature");
    });

    const response = await POST(makeRequest());
    expect(response.status).toBe(400);
  });
});

describe("Stripe webhook — payment_intent.succeeded", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates deposit to held and request to paid, sends 2 emails", async () => {
    mockEvent("payment_intent.succeeded", {
      id: "pi_test",
      metadata: { dateRequestId: "req-1" },
    });
    mockDb.query.deposits.findFirst.mockResolvedValue({
      id: "dep-1",
      amount: 5000,
      netAmount: 4500,
      stripePaymentIntentId: "pi_test",
    });
    mockDb.query.dateRequests.findFirst.mockResolvedValue({
      id: "req-1",
      requester: { id: "man-1", email: "man@test.com", name: "John" },
      target: { id: "woman-1", email: "woman@test.com", name: "Jane" },
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    // 2 updates: deposit status + request status
    expect(mockDb.update).toHaveBeenCalledTimes(2);
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(2);
  });

  it("skips processing if dateRequestId is missing from metadata", async () => {
    mockEvent("payment_intent.succeeded", {
      id: "pi_test",
      metadata: {}, // no dateRequestId
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mockDb.update).not.toHaveBeenCalled();
  });
});

describe("Stripe webhook — account.updated", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets isStripeVerified when charges_enabled is true", async () => {
    mockEvent("account.updated", {
      id: "acct_test",
      charges_enabled: true,
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it("does not update DB when charges_enabled is false", async () => {
    mockEvent("account.updated", {
      id: "acct_test",
      charges_enabled: false,
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mockDb.update).not.toHaveBeenCalled();
  });
});

describe("Stripe webhook — customer.subscription.created", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates subscription record and sets premiumUntil", async () => {
    const periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
    mockEvent("customer.subscription.created", {
      id: "sub_test",
      customer: "cus_test",
      status: "active",
      billing_cycle_anchor: periodEnd,
      items: { data: [{ price: { id: "price_test" }, current_period_end: periodEnd }] },
    });
    mockDb.query.users.findFirst.mockResolvedValue({ id: "user-1" });
    mockDb.query.subscriptions.findFirst.mockResolvedValue(null); // no existing sub

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mockDb.insert).toHaveBeenCalledTimes(1);
    // premiumUntil update
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it("updates existing subscription instead of inserting", async () => {
    const periodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
    mockEvent("customer.subscription.updated", {
      id: "sub_test",
      customer: "cus_test",
      status: "active",
      billing_cycle_anchor: periodEnd,
      items: { data: [{ price: { id: "price_test" }, current_period_end: periodEnd }] },
    });
    mockDb.query.users.findFirst.mockResolvedValue({ id: "user-1" });
    mockDb.query.subscriptions.findFirst.mockResolvedValue({ id: "sub-existing" });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(mockDb.insert).not.toHaveBeenCalled();
    // 2 updates: subscription + premiumUntil
    expect(mockDb.update).toHaveBeenCalledTimes(2);
  });
});

describe("Stripe webhook — customer.subscription.deleted", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets subscription to canceled and clears premiumUntil", async () => {
    mockEvent("customer.subscription.deleted", {
      id: "sub_test",
      customer: "cus_test",
      status: "canceled",
      items: { data: [] },
    });
    mockDb.query.users.findFirst.mockResolvedValue({ id: "user-1" });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    // 2 updates: subscription canceled + premiumUntil null
    expect(mockDb.update).toHaveBeenCalledTimes(2);
  });
});
