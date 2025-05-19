import { createTRPCRouter, publicProcedure } from "../trpc";

export const creationRouter = createTRPCRouter({
  getAllClasses: publicProcedure.query(async ({ ctx }) => { 
    const classes = await ctx.prisma.class.findMany({include: {feats:true, startingEquipment: true}});
    console.log("Fetched classes", JSON.stringify(classes, null, 2));
    return classes;
  }),

  getAllSpecies: publicProcedure.query(async (_ctx) => {
    // TODO: Implement getAllSpecies
  }),

  getAllBackgrounds: publicProcedure.query(async (_ctx) => {
    // TODO: Implement getAllBackgrounds
  }),

  saveClass: publicProcedure.query(async (_ctx) => {
    // TODO: Implement saveClass
  }),

  saveSpecies: publicProcedure.query(async (_ctx) => {
    // TODO: Implement saveSpecies
  }),

  savebackground: publicProcedure.query(async (_ctx) => {
    // TODO: Implement savebackground
  }),

  getAvailableEquipment: publicProcedure.query(async () => {
    // TODO: Implement getAvailableEquipment
  }),

  saveEquipment: publicProcedure.query(async () => {
    // TODO: Implement saveEquipment
  }),

  // TODO: roll ability scores on client
  saveAbilityScores: publicProcedure.query(async () => {
    // TODO: Implement saveAbilityScores
  }),
});
