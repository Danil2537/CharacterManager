import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuth } from "@clerk/nextjs/server";
import type { IncomingMessage } from "http";
import { SpellcastingType } from "@prisma/client";

export const interactiveSheetRouter = createTRPCRouter({
    getCharacter: publicProcedure
    .input(z.object({ charId: z.number() }))
    .query(async ({ctx,input})=>{
    const char = await ctx.prisma.character.findFirst({
      where: { id: input.charId },
      include: {
        species: true,
        background: true,
        //subclass: true,
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

    getAvailableSpells: publicProcedure
    .input(z.object({ charId: z.number() }))
    .query(async ({ ctx, input }) => {
      const char = await ctx.prisma.character.findFirst({
        where: { id: input.charId },
        include: {
          characterClasses: {
            include: { class: { include: { spellsList: true } } },
          },
          spellsKnown: true,
        },
      });

      if (!char) throw new Error("Character not found");

      const highestSpellLevel = char.spellSlots.reduceRight(
        (acc, val, idx) => (acc === -1 && val > 0 ? idx : acc),
        -1
      );

      const newKnownSpells: number[] = [];

      for (const charClass of char.characterClasses) {
        const classData = charClass.class;
        if (!classData) continue;

        const relevantSpells = classData.spellsList.filter(
          (spell) => spell.level <= highestSpellLevel
        );

        if (classData.spellcastingType === SpellcastingType.Divine) {
          for (const spell of relevantSpells) {
            const alreadyKnown = char.spellsKnown.some((s) => s.id === spell.id);
            if (!alreadyKnown) {
              newKnownSpells.push(spell.id);
            }
          }
        }
      }

      // Connect new Divine class spells to the character
      if (newKnownSpells.length > 0) {
        await ctx.prisma.character.update({
          where: { id: input.charId },
          data: {
            spellsKnown: {
              connect: newKnownSpells.map((id) => ({ id })),
            },
          },
        });
      }

      // Re-fetch the updated character to return available spells
      const updatedChar = await ctx.prisma.character.findFirst({
        where: { id: input.charId },
        include: {
          characterClasses: {
            include: { class: { include: { spellsList: true } } },
          },
        },
      });

      const availableSpells = updatedChar?.characterClasses.flatMap((charClass) =>
        charClass.class?.spellsList.filter(
          (spell) => spell.level <= highestSpellLevel
        )
      ) ?? [];

      return availableSpells;
    }),
    learnSpell: publicProcedure
      .input(z.object({ charId: z.number(), spellId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.character.update({
          where: { id: input.charId },
          data: {
            spellsKnown: {
              connect: { id: input.spellId },
            },
          },
        });
      }),

      prepareSpell: publicProcedure
      .input(z.object({ charId: z.number(), spellId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const char = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          include: {
            spellsPrepared: true,
            spellsKnown: true,
          },
        });

        if (!char) throw new Error("Character not found");

        const spell = await ctx.prisma.spell.findUnique({
          where: { id: input.spellId },
        });

        if (!spell) throw new Error("Spell not found");

        const alreadyPrepared = char.spellsPrepared.some((s) => s.id === spell.id);
        if (alreadyPrepared) throw new Error("Spell already prepared");

        // Only check limit for non-cantrips
        if (spell.level > 0) {
          const nonCantripPreparedCount = char.spellsPrepared.filter((s) => s.level > 0).length;
          if (nonCantripPreparedCount >= (char?.spellsPreparedNum??0)) {
            throw new Error("You cannot prepare more spells.");
          }
        }

        return ctx.prisma.character.update({
          where: { id: input.charId },
          data: {
            spellsPrepared: {
              connect: { id: spell.id },
            },
          },
        });
      }),

      unprepareSpell: publicProcedure
        .input(z.object({ charId: z.number(), spellId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const char = await ctx.prisma.character.findUnique({
            where: { id: input.charId },
            include: { spellsPrepared: true },
          });

          if (!char) throw new Error("Character not found");

          const isPrepared = char.spellsPrepared.some((s) => s.id === input.spellId);
          if (!isPrepared) throw new Error("Spell is not prepared");

          return ctx.prisma.character.update({
            where: { id: input.charId },
            data: {
              spellsPrepared: {
                disconnect: { id: input.spellId },
              },
            },
          });
      }),




});