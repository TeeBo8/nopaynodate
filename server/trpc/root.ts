import { createTRPCRouter } from "./index";
import { usersRouter } from "./routers/users";
import { profilesRouter } from "./routers/profiles";
import { requestsRouter } from "./routers/requests";
import { depositsRouter } from "./routers/deposits";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  profiles: profilesRouter,
  requests: requestsRouter,
  deposits: depositsRouter,
});

export type AppRouter = typeof appRouter;
