import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuth } from "@clerk/nextjs/server";
import type { IncomingMessage } from "http";

export const interactiveSheetRouter = createTRPCRouter({
    getCharacter: publicProcedure
    .input(z.object({ charId: z.number() }))
    .query(async ({ctx,input})=>{
    const char = await ctx.prisma.character.findFirst({
      where: { id: input.charId },
      include: {
        species: true,
        background: true,
        subclass: true,
        characterClasses: {
          include: { class: true },
        },
        characterItems: {
          include: { item: true },
        },
        weaponProficiencies: {
          include: { weapon: true },
        },
        feats: true,
        attacks: true,
        spellsKnown: true,
        spellsPrepared: true,
      },
    });
    //console.log(`\n\n\nLOADED CHARACTER: ${char}`);
    return char;
    }),

    getAllItems: publicProcedure
    .input(z.object({charId: z.number()}))
    .query(async ({ctx,input})=>{
      const charItems = await ctx.prisma.characterItems.findMany({where: { characterId: input.charId }});
      const itemIds = (await charItems).map(charItem => charItem.itemId);
      console.log(itemIds);
      return ctx.prisma.item.findMany({where:itemIds.length > 0 ? {id:{ notIn: itemIds }} : {}});
    }),

    addItem: publicProcedure
    .input(z.object({charId: z.number(), itemId: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.characterItems.create({data: {characterId: input.charId, itemId: input.itemId}})
    }),

});