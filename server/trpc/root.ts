import { createTRPCRouter } from "./index";
import { usersRouter } from "./routers/users";
import { profilesRouter } from "./routers/profiles";
import { requestsRouter } from "./routers/requests";
import { depositsRouter } from "./routers/deposits";
import { messagesRouter } from "./routers/messages";
import { subscriptionsRouter } from "./routers/subscriptions";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  profiles: profilesRouter,
  requests: requestsRouter,
  deposits: depositsRouter,
  messages: messagesRouter,
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;
