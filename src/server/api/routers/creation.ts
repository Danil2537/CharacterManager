import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuth } from "@clerk/nextjs/server";
import type { IncomingMessage } from "http";

export const creationRouter = createTRPCRouter({
    getAllClasses: publicProcedure.query(async ({ ctx }) => { 
        const classes = await ctx.prisma.class.findMany();
        console.log("Fetched classes", JSON.stringify(classes, null, 2));
        return classes;

    }),
    getAllSpecies: publicProcedure.query(async ({ ctx }) => { }),
    getAllBackgrounds: publicProcedure.query(async ({ ctx }) => { }),
    saveClass: publicProcedure.query(async ({ ctx }) => { }),
    saveSpecies: publicProcedure.query(async ({ ctx }) => { }),
    savebackground: publicProcedure.query(async ({ctx})=>{}),
    getAvailableEquipment: publicProcedure.query(async ({})=>{}),
    saveEquipment: publicProcedure.query(async ({})=>{}),
    //TODO: roll ability scores on client
    saveAbilityScores: publicProcedure.query(async ({})=>{}),

});