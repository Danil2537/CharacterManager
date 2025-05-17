import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuth } from "@clerk/nextjs/server";
import type { IncomingMessage } from "http";

export const profileRouter = createTRPCRouter({
    getUserCharacters: publicProcedure.query(async ({ ctx }) => {
        const req = ctx.req as IncomingMessage | undefined;

        if (!req) {
            throw new Error("Request object is missing. Please try again.");
        }

        const { userId } = getAuth(ctx.req);

        if (userId) {
            const characters = await ctx.prisma.character.findMany({
                where: { clerkUserId: userId },
                include: {
                    species: true,
                    background: true,
                    subclass: true,
                    characterClasses: {
                        include: {
                            class: true
                        }
                    }
                }
            }) ?? [];

            console.log("Fetched characters with full details:", JSON.stringify(characters, null, 2)); // Log all fields with related data

            return characters;
        } else {
            throw new Error(
                "You are not authenticated. Please log in to see your characters and save the characters you're going to create."
            );
        }
    }),
});
