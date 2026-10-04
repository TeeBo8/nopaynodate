import { pgTable, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const genderEnum = pgEnum("gender", ["man", "woman"]);
export const reportReasonEnum = pgEnum("report_reason", [
  "spam",
  "fake_profile",
  "inappropriate",
  "other",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "paid",
  "accepted",
  "rejected",
  "completed",
  "refunded",
]);
export const depositStatusEnum = pgEnum("deposit_status", [
  "pending",
  "held",
  "released",
  "refunded",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
]);

// Users
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  gender: genderEnum("gender"),
  birthdate: text("birthdate"),
  city: text("city"),
  bio: text("bio"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeAccountId: text("stripe_account_id"),
  isStripeVerified: boolean("is_stripe_verified").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  premiumUntil: timestamp("premium_until"),
  // Démo : identifiant du bac à sable d'un visiteur (null pour le décor et les vrais comptes)
  demoSandboxId: text("demo_sandbox_id"),
  // Démo : profil de décor, en lecture seule
  isSeed: boolean("is_seed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Sessions (Better Auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Accounts (Better Auth - OAuth providers)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Verifications (Better Auth)
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Profiles
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  photos: text("photos").array().notNull().default([]),
  depositAmount: integer("deposit_amount").notNull().default(5000), // centimes, défaut 50$
  isActive: boolean("is_active").notNull().default(true),
  lastActive: timestamp("last_active").defaultNow(),
});

// Date Requests
export const dateRequests = pgTable("date_requests", {
  id: text("id").primaryKey(),
  requesterId: text("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  targetId: text("target_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: requestStatusEnum("status").notNull().default("pending"),
  requesterConfirmed: boolean("requester_confirmed").notNull().default(false),
  targetConfirmed: boolean("target_confirmed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Deposits
export const deposits = pgTable("deposits", {
  id: text("id").primaryKey(),
  dateRequestId: text("date_request_id")
    .notNull()
    .unique()
    .references(() => dateRequests.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // centimes
  commission: integer("commission").notNull(), // 10%
  netAmount: integer("net_amount").notNull(), // amount - commission
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  stripeTransferId: text("stripe_transfer_id"),
  status: depositStatusEnum("status").notNull().default("held"),
  heldAt: timestamp("held_at").defaultNow(),
  releasedAt: timestamp("released_at"),
  refundedAt: timestamp("refunded_at"),
});

// Messages
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  dateRequestId: text("date_request_id")
    .notNull()
    .references(() => dateRequests.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Reports
export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reportedUserId: text("reported_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: reportReasonEnum("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations (pour les requêtes relationnelles Drizzle)
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  sentRequests: many(dateRequests, { relationName: "requester" }),
  receivedRequests: many(dateRequests, { relationName: "target" }),
  messages: many(messages),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const dateRequestsRelations = relations(dateRequests, ({ one }) => ({
  requester: one(users, {
    fields: [dateRequests.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  target: one(users, {
    fields: [dateRequests.targetId],
    references: [users.id],
    relationName: "target",
  }),
  deposit: one(deposits, {
    fields: [dateRequests.id],
    references: [deposits.dateRequestId],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  dateRequest: one(dateRequests, {
    fields: [deposits.dateRequestId],
    references: [dateRequests.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  dateRequest: one(dateRequests, {
    fields: [messages.dateRequestId],
    references: [dateRequests.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
  reportedUser: one(users, { fields: [reports.reportedUserId], references: [users.id] }),
}));
