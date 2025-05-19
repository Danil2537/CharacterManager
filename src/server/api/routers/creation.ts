import { createTRPCRouter, publicProcedure } from "../trpc";
import {z} from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

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
        chosenClassId: z.number(), 
        chosenSpeciesId: z.number(), 
        chosenBackgroundId: z.number(), 
        abilityScores: z.array(z.number()), 
        chosenEquipmentIds: z.array(z.number()) }))
    .mutation(async ({ctx, input})=> {
        console.log(input);
        const chosenClass = await ctx.prisma.class.findFirst({where: {id: input.chosenClassId}});
        const chosenSpecies = await ctx.prisma.species.findFirst({where: {id: input.chosenSpeciesId}});
        //const chosenBackground = await ctx.prisma.background.findFirst({where: {id: input.chosenBackgroundId}});
        const chosenEquipment = await ctx.prisma.item.findMany({where: {id: {in: input.chosenEquipmentIds}}});
        const { userId } = getAuth(ctx.req);
        // if (!chosenSpecies || !chosenBackground || !chosenClass) {
        //     throw new TRPCError({
        //         code: "BAD_REQUEST",
        //         message: "Invalid species, background, or class selected"
        //     });
        // }
        if (!userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a character."
        });
        }
        return {};
    //     return ctx.prisma.character.create({
    //     data: {
    //       name: "deafault charname",
    //       clerkUserId: userId,
    //       speciesID: input.chosenSpeciesId,
    //       backgroundID: input.chosenBackgroundId,
    //       abilityScores: input.abilityScores,
    //       //skillProfs: [chosenClass?.availableSkillProfs[0], chosenClass?.availableSkillProfs[1]]
    //       savingThrows: chosenClass?.saveProfs,
    //       armorProfs: chosenClass?.armorTraining,
    //       knownLanguage: chosenSpecies
    //     },
    //   });

        //TODO: char creation
    }),
});
