import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
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
        characterClasses: true,
        characterItems: true,
        weaponProficiencies: {
          include: { weapon: true },
        },
        feats: true,
        attacks: true,
        spellsKnown: true,
        spellsPrepared: true,
      },
    });
    return char;
    }),

    getAllItems: publicProcedure
      .input(z.object({ charId: z.number() }))
      .query(async ({ ctx, input }) => {
        const character = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          include: { characterItems: true },
        });

        const itemIds = character?.characterItems.map(item => item.id) ?? [];

        return ctx.prisma.item.findMany({
          where: itemIds.length > 0 ? { id: { notIn: itemIds } } : {},
        });
      }),

    addItem: publicProcedure
      .input(z.object({ charId: z.number(), itemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.character.update({
          where: { id: input.charId },
          data: {
            characterItems: {
              connect: { id: input.itemId },
            },
          },
        });
      }),

    getAvailableSpells: publicProcedure
    .input(z.object({ charId: z.number() }))
    .query(async ({ ctx, input }) => {
      const char = await ctx.prisma.character.findFirst({
        where: { id: input.charId },
        include: {
          characterClasses: {include: {spellsList: true}},
          spellsKnown: true,
        },
      });

      if (!char) throw new Error("Character not found");
      const isZero = (element:number) => element == 0;
      const highestSpellLevel = char.spellSlots.findIndex(isZero);
      console.log(`\n\n\n\n\nHighest spell level: ${highestSpellLevel}\n\n\n\n\n`);
      const newKnownSpells: number[] = [];

      for (const charClass of char.characterClasses) {
        const classData = charClass;
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
          characterClasses: { include: { spellsList: true } }
        },
      });

      const availableSpells = updatedChar?.characterClasses.flatMap((charClass) =>
        charClass?.spellsList.filter(
          (spell) => spell.level <= highestSpellLevel
        )
      ) ?? [];

      return availableSpells;
    }),
    
    learnSpell: publicProcedure
      .input(z.object({ charId: z.number(), spellId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const spell = await ctx.prisma.spell.findFirst({where: {id: input.spellId}});
        const char = await ctx.prisma.character.findFirst(
          {where: { id: input.charId }, 
          include: {characterClasses: true, spellsPrepared: true, spellsKnown: true}
        });
        if((spell?.level??0)>0) {
          if(char?.characterClasses[0]?.spellcastingType==SpellcastingType.Innate)
          {
            await ctx.prisma.character.update({
              where: { id: input.charId },
              data: {
                spellsKnown: {
                  connect: { id: spell?.id },
                },
              },
            });
            if((char?.spellsPreparedNum??0)>char?.spellsPrepared.length) {
              await ctx.prisma.character.update({
              where: { id: input.charId },
              data: {
                spellsPrepared: {
                  connect: { id: spell?.id },
                },
              },
            });
            }
            else 
            {
              console.log(`ERROR: INNATE SPELLCASTER CANNOT LEAERN MORE SPELLS THAN THEY CAN PREPARE`); //TODO: add this constraint in ui
            }
          }
        }
        else {
          if((char?.knownCantripsNum??0)>(char?.spellsKnown.filter((spell) => spell.level == 0).length??0))
          {
            console.log(`\n\n\nAlready known cantrips: ${char?.spellsKnown.filter((spell) => spell.level == 0).length}\n\n\n`);
            await ctx.prisma.character.update({
              where: { id: input.charId },
              data: {
                spellsKnown: {
                  connect: { id: spell?.id },
                },
              },
            });
            await ctx.prisma.character.update({
              where: { id: input.charId },
              data: {
                spellsPrepared: {
                  connect: { id: spell?.id },
                },
              },
            });
          }
          else {
            console.log(`ERROR: CHARACTER CAN'T KNOW MORE CANTRIPS`);
          }
        }
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
        const knownCantripsCount = char.spellsKnown.filter(s => s.level === 0).length;
        if ((char.knownCantripsNum ?? 0)  <= knownCantripsCount){
          throw new Error("Cannot learn (prepare) more cantrips");
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

    useSpellSlot: publicProcedure
      .input(z.object({ charId: z.number(), spellLevel: z.number().min(1).max(9) }))
      .mutation(async ({ ctx, input }) => {
        const char = await ctx.prisma.character.findUniqueOrThrow({
          where: { id: input.charId },
        });

        const updatedSlots = [...(char?.currentSpellSlots ?? Array(9).fill(0))];
        if ((updatedSlots[input.spellLevel - 1]??0) > 0) {
          const levelIndex = input.spellLevel - 1;
          if (typeof updatedSlots[levelIndex] === 'number' && updatedSlots[levelIndex] > 0) {
            updatedSlots[levelIndex]--;
          }
        }

        await ctx.prisma.character.update({
          where: { id: input.charId },
          data: { currentSpellSlots: updatedSlots },
        });
      }),


});
