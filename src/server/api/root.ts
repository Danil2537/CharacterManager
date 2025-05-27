//import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "../../server/api/trpc";
import {profileRouter} from "./routers/profile";
import {creationRouter} from "./routers/creation";
import {interactiveSheetRouter} from "./routers/interactive_sheet";
import {classicSheetRouter} from "./routers/classic_sheet";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    //post: postRouter,
    profile: profileRouter,
    creation: creationRouter,
    interactiveSheet: interactiveSheetRouter,
    classicSheet: classicSheetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
