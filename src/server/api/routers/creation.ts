import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Alignment, Language, Skill, SpellcastingType } from "@prisma/client";
import { Ability } from "@prisma/client"; 

const abilityIndexMap: Record<Ability, number> = {
  Strength: 0,
  Dexterity: 1,
  Constitution: 2,
  Intelligence: 3,
  Wisdom: 4,
  Charisma: 5,
};

export const creationRouter = createTRPCRouter({
  getAllClasses: publicProcedure.query(async ({ ctx }) => {
    const classes = await ctx.prisma.class.findMany({ include: { feats: true, startingEquipment: true } });
    console.log("Fetched classes", JSON.stringify(classes, null, 2));
    return classes;
  }),

  getAllSpecies: publicProcedure.query(async ({ ctx }) => {
    const species = await ctx.prisma.species.findMany({ include: { feats: true, grantedSpells: true } });
    console.log("Fetched Species: ", JSON.stringify(species, null, 2));
    return species;
  }),

  getAllBackgrounds: publicProcedure.query(async ({ ctx }) => {
    const backgrounds = await ctx.prisma.background.findMany({ include: { feats: true, items: true, grantedSpells: true } });
    console.log("Fetched Backgrounds: ", JSON.stringify(backgrounds, null, 2));
    return backgrounds;
  }),

  createCharacter: publicProcedure
    .input(
      z.object({
        chosenName: z.string(),
        chosenClassId: z.number(),
        chosenSpeciesId: z.number(),
        chosenBackgroundId: z.number(),
        abilityScores: z.object({
          strength: z.number(),
          dexterity: z.number(),
          constitution: z.number(),
          intelligence: z.number(),
          wisdom: z.number(),
          charisma: z.number(),
        }),
        chosenEquipmentIds: z.array(z.number()),
        knownLanguages: z.array(z.nativeEnum(Language)),
        skillProfs: z.array(z.nativeEnum(Skill)),
        skillExpertices: z.array(z.nativeEnum(Skill)).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [chosenClass, chosenSpecies, chosenBackground, chosenEquipment] = await Promise.all([
        ctx.prisma.class.findFirst({ where: { id: input.chosenClassId }, include: { spellsList: true, feats: true }}),
        ctx.prisma.species.findFirst({ where: { id: input.chosenSpeciesId }, include: {feats: true}}),
        ctx.prisma.background.findFirst({ where: { id: input.chosenBackgroundId }, include: {feats: true}}),
        ctx.prisma.item.findMany({ where: { id: { in: input.chosenEquipmentIds } } }),
      ]);

      const { userId } = getAuth(ctx.req);
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to create a character." });
      }

      if (!chosenClass || !chosenSpecies || !chosenBackground) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid species, background, or class selected." });
      }

      let carryingCapacity;
      switch (chosenSpecies.size) {
        case "Tiny": carryingCapacity = input.abilityScores.strength * 7.5; break;
        case "Small":
        case "Medium": carryingCapacity = input.abilityScores.strength * 15; break;
        case "Large": carryingCapacity = input.abilityScores.strength * 30; break;
        case "Huge": carryingCapacity = input.abilityScores.strength * 60; break;
        case "Gargantuan": carryingCapacity = input.abilityScores.strength * 120; break;
        default: carryingCapacity = input.abilityScores.strength * 15; break;
      }

      const dexMod = Math.floor((input.abilityScores.dexterity - 10) / 2);
      const conMod = Math.floor((input.abilityScores.constitution - 10) / 2);
      const wisMod = Math.floor((input.abilityScores.wisdom - 10) / 2);

      let spellAbility: Ability | undefined;
      let spellSlots: number[] = [];
      let currentSpellSlots: number[] = [];
      let spellSaveDC: number | undefined;
      let spellsPreparedNum: number | undefined;
      let knownCantripsNum: number | undefined;

      if (chosenClass.grantsSpellcasting) {
        spellAbility = chosenClass.primaryAbility;

        if (chosenClass.spellSlots) {
          const spellSlotsMatrix = chosenClass.spellSlots as number[][];
          spellSlots = spellSlotsMatrix[0] ?? Array(9).fill(0);
          currentSpellSlots = [...spellSlots];

          const spellAbilityIndex = abilityIndexMap[spellAbility];
          const spellAbilityScore = [
            input.abilityScores.strength,
            input.abilityScores.dexterity,
            input.abilityScores.constitution,
            input.abilityScores.intelligence,
            input.abilityScores.wisdom,
            input.abilityScores.charisma,
          ][spellAbilityIndex] ?? 0;

          spellSaveDC = 8 + Math.floor((spellAbilityScore - 10) / 2) + 2;
          spellsPreparedNum = chosenClass.spellsPrepared?.[0] ?? 0;

          const highestSpellLevel = spellSlots.reduceRight((acc, val, idx) =>
            acc === -1 && val > 0 ? idx : acc, -1
          );

          const availableSpells = chosenClass.spellsList.filter(
            (spell) => spell.level <= highestSpellLevel
          );
          
          console.log("AVAILABLE SPELLS:", JSON.stringify(availableSpells, null, 2)); // ✅ safe logging

          switch (chosenClass.spellcastingType) {
            case SpellcastingType.Arcane:
              // Can use this if you plan to later
              break;
            case SpellcastingType.Divine:
              // Also can be used if needed
              break;
            case SpellcastingType.Innate:
            default:
              // ...
              break;
          }

          knownCantripsNum = chosenClass.knownCantripsNum?.[0] ?? 0;
        }
      }

      const featIds = Array.from(
      new Set([
        ...chosenClass?.feats.map((f) => f.id) ?? [],
        ...chosenSpecies?.feats.map((f) => f.id) ?? [],
        ...chosenBackground?.feats.map((f) => f.id) ?? [],
      ]));

      const character = await ctx.prisma.character.create({
        data: {
          name: input.chosenName,
          clerkUserId: userId,
          speciesID: input.chosenSpeciesId,
          backgroundID: input.chosenBackgroundId,
          abilityScores: [
            input.abilityScores.strength,
            input.abilityScores.dexterity,
            input.abilityScores.constitution,
            input.abilityScores.intelligence,
            input.abilityScores.wisdom,
            input.abilityScores.charisma,
          ],
          savingThrows: chosenClass.saveProfs,
          armorProfs: chosenClass.armorTraining,
          skillProfs: input.skillProfs,
          skillExpertices: input.skillExpertices ?? [],
          knownLanguage: input.knownLanguages,
          initiative: dexMod,
          speed: chosenSpecies.speed,
          proficiencyBonus: 2,
          armorClass: 10 + dexMod,
          exhaustionLevel: 0,
          maxHitPoints: chosenClass.hitDiceType + conMod,
          currentHitPoints: chosenClass.hitDiceType + conMod,
          hitDice: { num: 1, faces: chosenClass.hitDiceType },
          experience: 0,
          level: 1,
          passivePerception: 10 + wisMod,
          carryingCapacity: carryingCapacity,
          alignment: Alignment.LawfulGood,
          classLevels: [1],
          spellAbility,
          spellSlots,
          currentSpellSlots,
          spellSaveDC,
          spellsPreparedNum,
          knownCantripsNum,
          characterClasses: {
            connect: {id: chosenClass.id}
          },
          characterItems: {
            connect: chosenEquipment.map((item) => ({ id: item.id })),
          },
          feats: {
            connect: featIds.map((id) => ({ id })),
          },
        },
      });
      
      
      
        await Promise.all(chosenEquipment
          .filter(item => item.isWeapon)
          .map(async item => {
            console.log(`\n\n\nCREATING AN ATTACK FROM ITEM: ${item.name}\n\n\n`);
            await ctx.prisma.attack.create({
              data: {
                name: item.name,
                toHitBonus: Math.floor(((character?.abilityScores[0] ?? 0) - 10) / 2),
                notes: "",
                damageDice: item.damageDice ?? { num: 1, faces: 4 },
                damageTypes: item.damageType ?? "",
                ability: Ability.Strength,
                addProfBonus: false,
                additionalModifier: 0,
                Character: {
                  connect: { id: character.id },
                },
              },
            });
          }));
      

      // await ctx.prisma.characterClasses.create({
      //   data: {
      //     characterId: character.id,
      //     classId: chosenClass.id,
      //   },
      // });

      // if (chosenEquipment.length > 0) {
      //   await ctx.prisma.characterItems.createMany({
      //     data: chosenEquipment.map((item) => ({
      //       characterId: character.id,
      //       itemId: item.id,
      //     })),
      //   });
      // }

      if (chosenClass.weaponProfs?.length) {
        await ctx.prisma.characterWeaponProficiency.createMany({
          data: chosenClass.weaponProfs.map((weaponProperty) => ({
            characterId: character.id,
            property: weaponProperty,
          })),
          skipDuplicates: true,
        });
      }

      return { characterId: character.id };
    }),
});
