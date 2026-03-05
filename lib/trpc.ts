import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { type AppRouter } from "@/server/trpc/root";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
