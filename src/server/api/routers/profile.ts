import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAuth } from "@clerk/nextjs/server";
import type { IncomingMessage } from "http";
import { TRPCError } from "@trpc/server";
import {WeaponProperty} from "@prisma/client"

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
                    //subclass: true,
                    characterClasses: true,
                }
            }) ?? [];

            console.log("Fetched characters with full details:", JSON.stringify(characters, null, 2));

            return characters;
        } else {
            throw new Error(
                "You are not authenticated. Please log in to see your characters and save the characters you're going to create."
            );
        }
    }),

cloneCharacter: publicProcedure
  .input(z.object({ charId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    const orig = await ctx.prisma.character.findFirst({
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

    if (!orig) throw new Error("Original character not found");

    let newHitDice = orig.hitDice;
    if (!newHitDice && orig.classLevels && orig.characterClasses) {
      newHitDice = orig.classLevels.map((num, i) => ({
        num: num ?? 1,
        faces: orig.characterClasses[i]?.hitDiceType ?? 6,
      }));
    }

    const character = await ctx.prisma.character.create({
      data: {
        name: orig.name + " (Clone)",
        clerkUserId: orig.clerkUserId,
        speciesID: orig.speciesID,
        backgroundID: orig.backgroundID,
        abilityScores: [
          orig.abilityScores[0] ?? 10,
          orig.abilityScores[1] ?? 10,
          orig.abilityScores[2] ?? 10,
          orig.abilityScores[3] ?? 10,
          orig.abilityScores[4] ?? 10,
          orig.abilityScores[5] ?? 10,
        ],
        savingThrows: orig.savingThrows,
        armorProfs: orig.armorProfs,
        skillProfs: orig.skillProfs,
        skillExpertices: orig.skillExpertices ?? [],
        knownLanguage: orig.knownLanguage,
        initiative: orig.initiative,
        speed: orig.speed,
        proficiencyBonus: orig.proficiencyBonus,
        armorClass: orig.armorClass,
        exhaustionLevel: orig.exhaustionLevel,
        maxHitPoints: orig.maxHitPoints,
        currentHitPoints: orig.currentHitPoints,
        hitDice: orig?.hitDice??orig.classLevels.map((num, i) => ({num: num ?? 1, faces: orig.characterClasses[i]?.hitDiceType ?? 6,})),
        experience: orig.experience,
        level: orig.level,
        passivePerception: orig.passivePerception ?? Math.floor(((orig.abilityScores[4] ?? 10) - 10) / 2) + 10,
        carryingCapacity: orig.carryingCapacity ?? 100,
        alignment: orig.alignment,
        classLevels: orig.classLevels,
         characterClasses: {
          connect: orig.characterClasses.map((cls) => ({ id: cls.id })),
        },
        characterItems: {
          connect: orig.characterItems.map((item) => ({ id: item.id })),
        },
      },
    });

    // if (orig.characterClasses) {
    //   await ctx.prisma.characterClasses.createMany({
    //     data: orig.characterClasses.map((cc) => ({
    //       characterId: character.id,
    //       classId: cc.class.id,
    //     })),
    //   });
    // }

    // if (orig.characterItems) {
    //   await ctx.prisma.characterItems.createMany({
    //     data: orig.characterItems.map((ci) => ({
    //       characterId: character.id,
    //       itemId: ci.item.id,
    //     })),
    //     skipDuplicates: true,
    //   });
    // }

    if (orig.weaponProficiencies) {
      await ctx.prisma.characterWeaponProficiency.createMany({
        data: orig.weaponProficiencies.map((wp) => ({
          characterId: character.id,
          weaponId: wp.weaponId ?? null,
          property: wp.property ?? null,
        })),
        skipDuplicates: true,
      });
    }

    return character;
  }),

exportCharacter: publicProcedure
  .input(z.object({ charId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    const character = await ctx.prisma.character.findFirst({
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
    
    if (!character) throw new Error("Character not found");
    return character;
  }),


importCharacter: publicProcedure
  .input(z.object({ characterData: z.any() }))
  .mutation(async ({ ctx, input }) => {
    const orig = input.characterData;


    const currentUser = getAuth(ctx.req);
    if (!currentUser || !currentUser.userId) {
        throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to import a character.",
        });
    }

    const character = await ctx.prisma.character.create({
        data: {
        name: orig?.name + "Imported",
        clerkUserId: currentUser.userId,
        speciesID: orig?.speciesID,
        backgroundID: orig?.backgroundID,
        abilityScores: orig?.abilityScores,
        savingThrows: orig?.savingThrows,
        armorProfs: orig?.armorProfs,
        skillProfs: orig?.skillProfs,
        skillExpertices: orig?.skillExpertices ?? [],
        knownLanguage: orig?.knownLanguage,
        initiative: orig?.initiative,
        speed: orig?.speed,
        proficiencyBonus: orig?.proficiencyBonus,
        armorClass: orig?.armorClass,
        exhaustionLevel: orig?.exhaustionLevel,
        maxHitPoints: orig?.maxHitPoints,
        currentHitPoints: orig?.currentHitPoints,
        hitDice: orig?.HitDice ?? [{"num":1,"faces":8}],
        experience: orig?.experience,
        level: orig?.level,
        passivePerception: orig?.passivePerception,
        carryingCapacity: orig?.carryingCapacity ?? 100,
        alignment: orig?.alignment,
        classLevels: orig?.classLevels,
        characterClasses: {
          connect: orig.characterClasses.map((cls) => ({ id: cls.id })),
        },
        characterItems: {
          connect: orig.characterItems.map((item) => ({ id: item.id })),
        },
        },
    });

    // if (orig.characterClasses) {
    //     await ctx.prisma.characterClasses.createMany({
    //     data: orig.characterClasses.map((cc: { class: { id: number; }; }) => ({
    //         characterId: character.id,
    //         classId: cc.class.id,
    //     })),
    //     });
    // }

    // if (orig.characterItems) {
    //     await ctx.prisma.characterItems.createMany({
    //     data: orig.characterItems.map((ci: { item: { id: number; }; }) => ({
    //         characterId: character.id,
    //         itemId: ci.item.id,
    //     })),
    //     skipDuplicates: true,
    //     });
    // }

    if (orig.weaponProficiencies) {
        await ctx.prisma.characterWeaponProficiency.createMany({
        data: orig.weaponProficiencies.map((wp: { weaponId: number; property: WeaponProperty; }) => ({
            characterId: character.id,
            weaponId: wp.weaponId ?? null,
            property: wp.property ?? null,
        })),
        skipDuplicates: true,
        });
    }

    return character;
    }),


  deleteCharacter: publicProcedure.input(z.object({id: z.number()}))
   .mutation(async ({ ctx, input }) => {
    return ctx.prisma.character.delete({where: {id: input.id}});
   }),

});
