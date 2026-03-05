import { createTRPCRouter } from "./index";
import { usersRouter } from "./routers/users";
import { profilesRouter } from "./routers/profiles";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  profiles: profilesRouter,
});

export type AppRouter = typeof appRouter;
