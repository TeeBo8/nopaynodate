/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/stripe/client", () => ({
  stripe: {
    paymentIntents: { retrieve: vi.fn(), create: vi.fn(), cancel: vi.fn() },
    refunds: { create: vi.fn() },
    transfers: { create: vi.fn() },
    subscriptions: { cancel: vi.fn() },
    customers: { create: vi.fn() },
    checkout: { sessions: { create: vi.fn() } },
    accounts: { create: vi.fn() },
    accountLinks: { create: vi.fn() },
  },
}));
vi.mock("@/server/emails", () => ({ sendEmail: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock("@/server/db", () => ({ db: {} }));
vi.mock("@/server/pusher/server", () => ({ pusherServer: { trigger: vi.fn() } }));

import { requestsRouter } from "@/server/trpc/routers/requests";
import { depositsRouter } from "@/server/trpc/routers/deposits";
import { usersRouter } from "@/server/trpc/routers/users";
import { profilesRouter } from "@/server/trpc/routers/profiles";
import { messagesRouter } from "@/server/trpc/routers/messages";
import { subscriptionsRouter } from "@/server/trpc/routers/subscriptions";
import { createCallerFactory } from "@/server/trpc/index";
import { stripe } from "@/server/stripe/client";
import { pusherServer } from "@/server/pusher/server";
import { DEMO_MAX_MESSAGES_PER_CHAT, DEMO_MAX_REQUESTS_PER_ACCOUNT } from "@/lib/demo";
import { createMockDb, type MockDb } from "../utils/mock-db";

function makeCtx(userId: string, db: MockDb, isDemo: boolean) {
  return {
    db: db as any,
    session: {
      user: { id: userId, name: "Test", email: "test@test.com" },
      session: { id: "sess-1", userId, expiresAt: new Date(Date.now() + 86400000) },
    },
    req: {} as any,
    isDemo,
  } as any;
}

const MAN_ID = "man-1";
const WOMAN_ID = "woman-1";
const forbidden = expect.objectContaining({ code: "FORBIDDEN" });

let db: MockDb;
beforeEach(() => {
  db = createMockDb();
  vi.clearAllMocks();
});

describe("démo : une demande ne vise que la femme du même bac à sable", () => {
  const send = (target: object, alreadySent = 0) => {
    db.query.users.findFirst
      .mockResolvedValueOnce({ id: MAN_ID, gender: "man", demoSandboxId: "box-A" })
      .mockResolvedValueOnce({ id: WOMAN_ID, gender: "woman", ...target });
    db.query.profiles.findFirst.mockResolvedValue({ userId: WOMAN_ID });
    db.query.dateRequests.findFirst.mockResolvedValue(null);
    db.query.dateRequests.findMany.mockResolvedValue(Array.from({ length: alreadySent }, () => ({})));
    return createCallerFactory(requestsRouter)(makeCtx(MAN_ID, db, true)).send({
      targetId: WOMAN_ID,
    });
  };

  it("refuse un profil de décor", async () => {
    await expect(send({ isSeed: true, demoSandboxId: null })).rejects.toThrow(forbidden);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("refuse la femme d'un autre visiteur", async () => {
    await expect(send({ demoSandboxId: "box-B" })).rejects.toThrow(forbidden);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("accepte la femme du même bac à sable", async () => {
    await expect(send({ demoSandboxId: "box-A" })).resolves.toHaveProperty("id");
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("refuse au-delà du plafond de demandes par compte", async () => {
    await expect(
      send({ demoSandboxId: "box-A" }, DEMO_MAX_REQUESTS_PER_ACCOUNT)
    ).rejects.toThrow(forbidden);
    expect(db.insert).not.toHaveBeenCalled();
  });
});

describe("confirmation du rendez-vous", () => {
  const accepted = {
    id: "req-1",
    requesterId: MAN_ID,
    targetId: WOMAN_ID,
    status: "accepted",
    requesterConfirmed: false,
    targetConfirmed: true,
    deposit: { id: "dep-1", stripePaymentIntentId: "pi_test", netAmount: 4500, status: "held" },
  };
  const woman = { id: WOMAN_ID, email: "w@test.com", name: "Léa", stripeAccountId: "acct_demo_x" };

  it("démo : libère le dépôt sans aucun appel Stripe", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(accepted);
    db.query.users.findFirst.mockResolvedValue(woman);

    const caller = createCallerFactory(requestsRouter)(makeCtx(MAN_ID, db, true));
    await expect(caller.confirm({ requestId: "req-1" })).resolves.toEqual({ success: true });

    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
    expect(stripe.transfers.create).not.toHaveBeenCalled();
    // confirmation, dépôt → released, demande → completed
    expect(db.update).toHaveBeenCalledTimes(3);
  });

  it("démo : deux confirmations simultanées libèrent quand même le dépôt", async () => {
    // À la première lecture, personne n'a confirmé ; à la relecture, les deux drapeaux sont vrais
    const nobody = { ...accepted, targetConfirmed: false };
    const both = { ...accepted, requesterConfirmed: true, targetConfirmed: true };
    db.query.dateRequests.findFirst.mockResolvedValueOnce(nobody).mockResolvedValueOnce(both);
    db.query.users.findFirst.mockResolvedValue(woman);

    const caller = createCallerFactory(requestsRouter)(makeCtx(MAN_ID, db, true));
    await expect(caller.confirm({ requestId: "req-1" })).resolves.toEqual({ success: true });

    // confirmation, dépôt → released, demande → completed
    expect(db.update).toHaveBeenCalledTimes(3);
  });

  it("hors démo : si le versement Stripe échoue, rien n'est écrit en base", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue(accepted);
    db.query.users.findFirst.mockResolvedValue({ ...woman, stripeAccountId: "acct_real" });
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({ latest_charge: "ch_1" } as any);
    vi.mocked(stripe.transfers.create).mockRejectedValue(new Error("Stripe down"));

    const caller = createCallerFactory(requestsRouter)(makeCtx(MAN_ID, db, false));
    await expect(caller.confirm({ requestId: "req-1" })).rejects.toThrow("Stripe down");

    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("retour du paiement (deposits.syncPayment)", () => {
  const pending = {
    id: "dep-1",
    status: "pending",
    dateRequestId: "req-1",
    stripePaymentIntentId: "pi_1",
    dateRequest: { requesterId: MAN_ID },
  };
  const call = (userId: string) =>
    createCallerFactory(depositsRouter)(makeCtx(userId, db, true)).syncPayment({
      paymentIntentId: "pi_1",
    });

  it("refuse le paiement de quelqu'un d'autre", async () => {
    db.query.deposits.findFirst.mockResolvedValue(pending);
    await expect(call("intrus")).rejects.toThrow(forbidden);
    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
  });

  it("ne change rien tant que Stripe n'a pas encaissé", async () => {
    db.query.deposits.findFirst.mockResolvedValue(pending);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({ status: "processing" } as any);
    await expect(call(MAN_ID)).resolves.toEqual({ status: "pending" });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("passe le dépôt en séquestre quand Stripe confirme", async () => {
    db.query.deposits.findFirst.mockResolvedValue(pending);
    vi.mocked(stripe.paymentIntents.retrieve).mockResolvedValue({ status: "succeeded" } as any);
    await expect(call(MAN_ID)).resolves.toEqual({ status: "held" });
    // dépôt → held, demande → paid
    expect(db.update).toHaveBeenCalledTimes(2);
  });

  it("ne refait rien si le dépôt est déjà traité", async () => {
    db.query.deposits.findFirst.mockResolvedValue({ ...pending, status: "released" });
    await expect(call(MAN_ID)).resolves.toEqual({ status: "released" });
    expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("démo : actions désactivées", () => {
  it("suppression de compte", async () => {
    const caller = createCallerFactory(usersRouter)(makeCtx(MAN_ID, db, true));
    await expect(caller.deleteAccount()).rejects.toThrow(forbidden);
  });

  it("signalement", async () => {
    const caller = createCallerFactory(usersRouter)(makeCtx(MAN_ID, db, true));
    await expect(
      caller.reportUser({ reportedUserId: WOMAN_ID, reason: "spam" })
    ).rejects.toThrow(forbidden);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("abonnement premium", async () => {
    const caller = createCallerFactory(subscriptionsRouter)(makeCtx(MAN_ID, db, true));
    await expect(caller.createCheckoutSession()).rejects.toThrow(forbidden);
    expect(stripe.customers.create).not.toHaveBeenCalled();
  });

  it("inscription Stripe Connect", async () => {
    const caller = createCallerFactory(depositsRouter)(makeCtx(WOMAN_ID, db, true));
    await expect(caller.createConnectedAccount()).rejects.toThrow(forbidden);
    expect(stripe.accounts.create).not.toHaveBeenCalled();
  });
});

describe("photos du profil", () => {
  const select = (rows: object[]) => {
    const limit = vi.fn().mockResolvedValue(rows);
    const where = vi.fn().mockReturnValue({ limit });
    const from = vi.fn().mockReturnValue({ where });
    (db as any).select = vi.fn().mockReturnValue({ from });
  };

  it("démo : les photos envoyées sont ignorées, le dépôt est enregistré", async () => {
    select([{ userId: WOMAN_ID }]);
    const caller = createCallerFactory(profilesRouter)(makeCtx(WOMAN_ID, db, true));
    // Ce que la démo a réellement en base : un avatar local, qui n'est pas une adresse Uploadthing
    await caller.upsert({ photos: ["/demo/avatars/lea.svg"], depositAmount: 8000 });

    const written = db.update.mock.results[0]?.value.set.mock.calls[0][0];
    expect(written).not.toHaveProperty("photos");
    expect(written).toHaveProperty("depositAmount", 8000);
  });

  it("hors démo : refuse une adresse qui ne vient pas d'Uploadthing", async () => {
    const caller = createCallerFactory(profilesRouter)(makeCtx(WOMAN_ID, db, false));
    await expect(
      caller.upsert({ photos: ["https://evil.example/tracker.png"] })
    ).rejects.toThrow(expect.objectContaining({ code: "BAD_REQUEST" }));
    await expect(
      caller.upsert({ photos: ["javascript:alert(1)"] })
    ).rejects.toThrow(expect.objectContaining({ code: "BAD_REQUEST" }));
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("hors démo : règles du compte", () => {
  it("refuse la suppression tant qu'un dépôt est en séquestre", async () => {
    db.query.dateRequests.findFirst.mockResolvedValue({ id: "req-1" });
    (db as any).delete = vi.fn();
    const caller = createCallerFactory(usersRouter)(makeCtx(WOMAN_ID, db, false));

    await expect(caller.deleteAccount()).rejects.toThrow(
      expect.objectContaining({ code: "PRECONDITION_FAILED" })
    );
    expect((db as any).delete).not.toHaveBeenCalled();
  });

  it("refuse une date de naissance invalide ou d'un mineur", async () => {
    const caller = createCallerFactory(usersRouter)(makeCtx(MAN_ID, db, false));
    const bad = expect.objectContaining({ code: "BAD_REQUEST" });
    const minor = `${new Date().getUTCFullYear() - 10}-01-01`;

    await expect(caller.updateProfile({ birthdate: "abc" })).rejects.toThrow(bad);
    await expect(caller.updateProfile({ birthdate: "1990-02-31" })).rejects.toThrow(bad);
    await expect(caller.updateProfile({ birthdate: minor })).rejects.toThrow(bad);
    expect(db.update).not.toHaveBeenCalled();

    await expect(caller.updateProfile({ birthdate: "1990-06-15" })).resolves.toBeUndefined();
    expect(db.update).toHaveBeenCalledTimes(1);
  });

  it("refuse un montant de dépôt qui n'est pas un nombre entier de centimes", async () => {
    const caller = createCallerFactory(profilesRouter)(makeCtx(WOMAN_ID, db, false));
    await expect(caller.upsert({ depositAmount: 2500.5 })).rejects.toThrow(
      expect.objectContaining({ code: "BAD_REQUEST" })
    );
  });
});

describe("démo : plafond de messages par conversation", () => {
  const openChat = {
    id: "req-1",
    requesterId: MAN_ID,
    targetId: WOMAN_ID,
    deposit: { status: "held" },
  };
  const withMessages = (n: number) => {
    db.query.dateRequests.findFirst.mockResolvedValue(openChat);
    (db.query as any).messages = {
      findMany: vi.fn().mockResolvedValue(Array.from({ length: n }, (_, i) => ({ id: `m${i}` }))),
    };
    return createCallerFactory(messagesRouter)(makeCtx(MAN_ID, db, true)).send({
      requestId: "req-1",
      content: "hello",
    });
  };

  it("laisse passer sous le plafond", async () => {
    await expect(withMessages(DEMO_MAX_MESSAGES_PER_CHAT - 1)).resolves.toHaveProperty("id");
    expect(pusherServer.trigger).toHaveBeenCalledTimes(1);
  });

  it("refuse une fois le plafond atteint", async () => {
    await expect(withMessages(DEMO_MAX_MESSAGES_PER_CHAT)).rejects.toThrow(forbidden);
    expect(db.insert).not.toHaveBeenCalled();
  });
});
