import { createTRPCRouter, publicProcedure } from "../trpc";
import {nativeEnum, z} from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Alignment, Size, Language, Skill, Ability, SpellcastingType } from "@prisma/client";
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
    const classes = await ctx.prisma.class.findMany({include: {feats:true, startingEquipment: true}});
    console.log("Fetched classes", JSON.stringify(classes, null, 2));
    return classes;
  }),

  getAllSpecies: publicProcedure.query(async ({ctx}) => {
    const species = await ctx.prisma.species.findMany({include:{feats:true, grantedSpells: true}});
    console.log("Fetched Species: ", JSON.stringify(species, null, 2));
    return species;
  }),

  getAllBackgrounds: publicProcedure.query(async ({ctx}) => {
    const backgrounds = await ctx.prisma.background.findMany({include:{feats:true, items: true, grantedSpells: true}});
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
      skillExpertices: z.array(z.nativeEnum(Skill)).optional(), // optional
    })
  )
  .mutation(async ({ ctx, input }) => {
    const [chosenClass, chosenSpecies, chosenBackground, chosenEquipment] = await Promise.all([
      ctx.prisma.class.findFirst({ where: { id: input.chosenClassId },include: {spellsList: true,},}),
      ctx.prisma.species.findFirst({ where: { id: input.chosenSpeciesId } }),
      ctx.prisma.background.findFirst({ where: { id: input.chosenBackgroundId } }),
      ctx.prisma.item.findMany({ where: { id: { in: input.chosenEquipmentIds } } }),
    ]);

    const { userId } = getAuth(ctx.req);
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a character.",
      });
    }

    if (!chosenClass || !chosenSpecies || !chosenBackground) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid species, background, or class selected.",
      });
    }

    let carryingCapacity;
    switch (chosenSpecies.size) {
      case "Tiny":
        carryingCapacity = input.abilityScores.strength * 7.5;
        break;
      case "Small":
      case "Medium":
        carryingCapacity = input.abilityScores.strength * 15;
        break;
      case "Large":
        carryingCapacity = input.abilityScores.strength * 30;
        break;
      case "Huge":
        carryingCapacity = input.abilityScores.strength * 60;
        break;
      case "Gargantuan":
        carryingCapacity = input.abilityScores.strength * 120;
        break;
      default:
        carryingCapacity = input.abilityScores.strength * 15;
        break;
    }

    const dexMod = Math.floor((input.abilityScores.dexterity - 10) / 2);
    const conMod = Math.floor((input.abilityScores.constitution - 10) / 2);
    const wisMod = Math.floor((input.abilityScores.wisdom - 10) / 2);

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
      },
    });
    if(chosenClass.grantsSpellcasting)
    {
      character.spellAbility = chosenClass.primaryAbility;
      if(chosenClass.spellSlots)
      {
        const spellSlotsMatrix = chosenClass.spellSlots as number[][];
        character.spellSlots = spellSlotsMatrix[character.level] ??[0,0,0,0,0,0,0,0,0];
        character.currentSpellSlots = character.spellSlots;
        if (character.spellAbility !== undefined && character.spellAbility !== null) {
          const spellAbilityIndex = abilityIndexMap[character.spellAbility];
          const spellAbilityScore = character.abilityScores[spellAbilityIndex] ?? 0;
          const proficiencyBonus = character.proficiencyBonus ?? 2;
          character.spellSaveDC = 8 + spellAbilityScore + proficiencyBonus;
        }
        character.spellsPreparedNum = chosenClass.spellsPrepared[0]??0;
        const highestSpellLevel = character.spellSlots.reduceRight((acc, val, idx) => {
          return acc === -1 && val > 0 ? idx : acc;
        }, -1);
        const availableSpells = chosenClass.spellsList.filter(spell => spell.level <= highestSpellLevel);
        switch(chosenClass.spellcastingType)
        {
          case SpellcastingType.Arcane:
            character.spellsKnownNum = character.spellsPreparedNum+2;
            break;
          case SpellcastingType.Divine:
            
            character.spellsKnownNum = availableSpells?.length ?? 0;
            break;
          case SpellcastingType.Innate:
            character.spellsKnownNum = character.spellsPreparedNum;
            break;
          default:
            character.spellsKnownNum = character.spellsPreparedNum;
        }
        character.knownCantripsNum = chosenClass.knownCantripsNum[0]??0;
      }
    }

    await ctx.prisma.characterClasses.create({
      data: {
        characterId: character.id,
        classId: chosenClass.id,
      },
    });

    if (chosenEquipment.length > 0) {
      await ctx.prisma.characterItems.createMany({
        data: chosenEquipment.map((item) => ({
          characterId: character.id,
          itemId: item.id,
        })),
      });
    }

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
