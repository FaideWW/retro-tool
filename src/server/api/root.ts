import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";
import { retroItemRouter } from "./routers/retroItem";
import { retrospectiveRouter } from "./routers/retrospective";
import { itemCommentRouter } from "./routers/itemComment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  retro: retrospectiveRouter,
  retroItem: retroItemRouter,
  itemComment: itemCommentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
