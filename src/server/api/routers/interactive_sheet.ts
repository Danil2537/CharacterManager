import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Ability, Skill, SpellcastingType, type Class, type Spell } from "@prisma/client";

const multiclassSpellSlots = [
[2, 0, 0, 0, 0, 0, 0, 0, 0], 
[3, 0, 0, 0, 0, 0, 0, 0, 0], 
[4, 2, 0, 0, 0, 0, 0, 0, 0], 
[4, 3, 0, 0, 0, 0, 0, 0, 0], 
[4, 3, 2, 0, 0, 0, 0, 0, 0], 
[4, 3, 3, 0, 0, 0, 0, 0, 0], 
[4, 3, 3, 1, 0, 0, 0, 0, 0], 
[4, 3, 3, 2, 0, 0, 0, 0, 0], 
[4, 3, 3, 3, 1, 0, 0, 0, 0], 
[4, 3, 3, 3, 2, 0, 0, 0, 0], 
[4, 3, 3, 3, 2, 1, 0, 0, 0], 
[4, 3, 3, 3, 2, 1, 0, 0, 0], 
[4, 3, 3, 3, 2, 1, 1, 0, 0], 
[4, 3, 3, 3, 2, 1, 1, 0, 0], 
[4, 3, 3, 3, 2, 1, 1, 1, 0], 
[4, 3, 3, 3, 2, 1, 1, 1, 0], 
[4, 3, 3, 3, 2, 1, 1, 1, 1], 
[4, 3, 3, 3, 3, 1, 1, 1, 1], 
[4, 3, 3, 3, 3, 2, 1, 1, 1], 
[4, 3, 3, 3, 3, 2, 2, 1, 1]]


const calculateMultiClassSpellSlotLevel = (classes: Class[], classLevels: number[]) => {
  let level = 0;
  classes.forEach((cls)=>{
    if(cls.spellcastingLevel==1)
    {
      level+=Math.floor((classLevels[classes.indexOf(cls)]??3)/3);
    }
    else if(cls.spellcastingLevel==2)
    {
      level+=Math.ceil((classLevels[classes.indexOf(cls)]??2)/2);
    }
    else if(cls.spellcastingLevel==3)
    {
      level+=(classLevels[classes.indexOf(cls)]??1);
    }
  });
  return level;
};


const abilityIndexMap: Record<Ability, number> = {
  Strength: 0,
  Dexterity: 1,
  Constitution: 2,
  Intelligence: 3,
  Wisdom: 4,
  Charisma: 5,
};

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
        const item = await ctx.prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Item not found");
        }

        const characterUpdateData: any = {
          characterItems: {
            connect: { id: input.itemId },
          },
        };

        if (item.isWeapon) {
          const attack = await ctx.prisma.attack.create({
            data: {
              name: item.name,
              toHitBonus: 0, 
              notes: item.description,
              damageDice: item.damageDice ?? { num: 1, type: 6 },
              damageTypes: item.damageType ?? "Slashing",
              ability: Ability.Strength, 
              addProfBonus: true,
              additionalModifier: 0,
              Character: {
                connect: { id: input.charId },
              },
            },
          });
          const characterUpdateWeapon: any = {
          attacks: {
            connect: { id: attack.id },
          },
          };
          await ctx.prisma.character.update({
          where: { id: input.charId },
          data: characterUpdateWeapon,
        });

        }

        return ctx.prisma.character.update({
          where: { id: input.charId },
          data: characterUpdateData,
        });
      }),

    deleteItem: publicProcedure
    .input(z.object({itemId: z.number()}))
    .mutation(async ({ctx,input})=>{
      return await ctx.prisma.item.delete({where: {id: input?.itemId}});
    }),

    getAvailableSpells: publicProcedure
      .input(z.object({ charId: z.number() }))
      .query(async ({ ctx, input }) => {
        const char = await ctx.prisma.character.findFirst({
          where: { id: input.charId },
          include: {
            characterClasses: {
              include: {
                spellsList: true,
              },
            },
            spellsKnown: true,
          },
        });

        if (!char) throw new Error("Character not found");

        const highestSpellLevel = char.spellSlots.findIndex((slot) => slot === 0);
        //const usableSpellLevel = highestSpellLevel === -1 ? 9 : highestSpellLevel - 1;
        const knownSpellIds = new Set(char.spellsKnown.map((s:Spell) => s.id));
        const availableSpells: typeof char.spellsKnown = [];
        const divineSpellIdsToConnect: number[] = [];

        for (const cls of char.characterClasses) {
          for (const spell of cls.spellsList) {
            const shouldInclude =
              spell.level <= highestSpellLevel && !knownSpellIds.has(spell.id);

            if (shouldInclude) {
              availableSpells.push(spell);

              if (cls.spellcastingType === SpellcastingType.Divine) {
                char.spellsKnown.push(spell);
                knownSpellIds.add(spell.id);
                divineSpellIdsToConnect.push(spell.id);
              }
            }
          }
        }

        // Persist newly known Divine spells to DB if any
        if (divineSpellIdsToConnect.length > 0) {
          await ctx.prisma.character.update({
            where: { id: char.id },
            data: {
              spellsKnown: {
                connect: divineSpellIdsToConnect.map((id) => ({ id })),
              },
            },
          });
        }

        const uniqueAvailableSpells = Array.from(
          new Map(availableSpells.map((spell) => [spell.id, spell])).values()
        );

        console.log(`\n\n\nAvailable Spells: ${JSON.stringify(uniqueAvailableSpells)}\n\n\n`);

        return uniqueAvailableSpells;
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

        if (spell.level > 0) {
          const nonCantripPreparedCount = char.spellsPrepared.filter((s) => s.level > 0).length;
          if (nonCantripPreparedCount >= (char?.spellsPreparedNum??0)) {
            throw new Error("You cannot prepare more spells.");
          }
        }
        const knownCantripsCount = char.spellsKnown.filter(s => s.level === 0).length;
        if ((char.knownCantripsNum ?? 0)  <= knownCantripsCount && spell.level==0){
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

    getCharAttacks: publicProcedure
      .input(z.object({ charId: z.number() }))
      .query(async ({ ctx, input }) => {
        const character = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          select: {
            abilityScores: true,
            proficiencyBonus: true,
          },
        });

        if (!character) throw new Error("Character not found");

        const attacks = await ctx.prisma.attack.findMany({
          where: { Characterid: input.charId },
        });

        const AbilityToIndex = (ability: Ability): number => {
          return {
            Strength: 0,
            Dexterity: 1,
            Constitution: 2,
            Intelligence: 3,
            Wisdom: 4,
            Charisma: 5,
          }[ability];
        };

        const updatedAttacks = await Promise.all(
          attacks.map(async (attack) => {
            const abilityIndex = AbilityToIndex(attack.ability);
            const abilityScore = character.abilityScores[abilityIndex] ?? 10;
            const abilityBonus = Math.floor((abilityScore - 10) / 2);
            const profBonus = attack.addProfBonus ? character.proficiencyBonus ?? 0 : 0;
            const newToHitBonus = abilityBonus + profBonus + (attack?.additionalModifier??0);

            return await ctx.prisma.attack.update({
              where: { id: attack.id },
              data: {
                toHitBonus: newToHitBonus,
              },
            });
          })
        );

        return updatedAttacks;
      }),


    updateAttacks: publicProcedure
      .input(z.object({
        attack: z.object({
          id: z.number(),
          name: z.string(),
          toHitBonus: z.number(),
          notes: z.string(),
          damageDice: z.any(), // could add a stricter z.object if desired
          damageTypes: z.string(),
          ability: z.nativeEnum(Ability),
          addProfBonus: z.boolean(),
          additionalModifier: z.number().nullable(),
          Characterid: z.number(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.attack.update({
          where: { id: input.attack.id },
          data: input.attack,
        });
      }),

      createAttack: publicProcedure
      .input(z.object({charId: z.number()}))
      .mutation(async ({ctx,input})=>{
          return await ctx.prisma.attack.create({data: {
              name: "Default attack name",
              toHitBonus: 0, 
              notes: "",
              damageDice: { num: 1, type: 6 },
              damageTypes: "Slashing",
              ability: Ability.Strength, 
              addProfBonus: false,
              additionalModifier: 0,
              Character: {
                connect: { id: input.charId },
              },
            },})
        }),

      longRest: publicProcedure
      .input(z.object({charId: z.number()}))
      .mutation(async ({input,ctx})=> {
        const character = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          select: {
            maxHitPoints: true,
            spellSlots: true,
          },
        });
        return await ctx.prisma.character.update({where: {id: input.charId}, 
          data: {
            exhaustionLevel: 0,
            currentHitPoints: character?.maxHitPoints,
            currentSpellSlots: character?.spellSlots,
          }})
      }),
      
      updateCurrentHitPoints: publicProcedure
      .input(z.object({charId: z.number(), newHitPoints: z.number()}))
      .mutation(async ({input, ctx})=>{
        return await ctx.prisma.character.update({where: {id: input.charId}, data: {currentHitPoints: input.newHitPoints}});
      }),

      shortRest: publicProcedure
      .input(z.object({charId: z.number(), hitDice: z.array(z.object({num: z.number(), faces: z.number()}))}))
      .mutation(async ({ctx,input})=>{
        let heal = 0;
        input.hitDice.forEach((hitDie)=> {
          heal += Math.floor(Math.random() * (hitDie.num*hitDie.faces - hitDie.num) + hitDie.num);
        });
        const character = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          select: {
            maxHitPoints: true,
            spellSlots: true,
            currentHitPoints: true,
          },
        });
        return await ctx.prisma.character.update({where: {id: input.charId}, data: {currentHitPoints: (character?.currentHitPoints??0)+heal}});
      }), 

      updateSkillProf: publicProcedure
        .input(z.object({
          charId: z.number(),
          skill: z.nativeEnum(Skill),
          isEnabled: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
          const character = await ctx.prisma.character.findUnique({
            where: { id: input.charId },
            select: { skillProfs: true },
          });

          if (!character) {
            throw new Error("Character not found");
          }

          const currentSkills = character.skillProfs || [];
          const hasSkill = currentSkills.includes(input.skill);

          let updatedSkills: Skill[];

          if (input.isEnabled && !hasSkill) {
            updatedSkills = [...currentSkills, input.skill];
          } else if (!input.isEnabled && hasSkill) {
            updatedSkills = currentSkills.filter(skill => skill !== input.skill);
          } else {
            return;
          }

          await ctx.prisma.character.update({
            where: { id: input.charId },
            data: { skillProfs: updatedSkills },
          });
        }),

      updateArmor: publicProcedure
      .input(z.object({charId: z.number(), newAC: z.number()}))
      .mutation(async ({ctx,input})=> {
        return await ctx.prisma.character.update({where: {id: input.charId}, data: {armorClass: (input?.newAC??10)}});
      }),

      getAllClasses: publicProcedure.query(async ({ ctx }) => {
        const classes = await ctx.prisma.class.findMany({ include: { feats: true, startingEquipment: true } });
        //console.log("Fetched classes", JSON.stringify(classes, null, 2));
        return classes;
      }),

    levelUp: publicProcedure
      .input(z.object({ charId: z.number(), leveledClassId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const character = await ctx.prisma.character.findUnique({
          where: { id: input.charId },
          include: { characterClasses: {include: {feats: true, grantedSpells: {include: {Spell: true}}}}, 
          feats: true, 
          species: {include: {feats: true, grantedSpells: {include: {Spell: true}}}}, 
          background: {include: {feats: true, grantedSpells: {include: {Spell: true}}}}, 
          weaponProficiencies: true,
          spellsKnown: true,
          spellsPrepared: true,
        }});
        const leveledClass = await ctx.prisma.class.findUnique({
          where: { id: input.leveledClassId },
          include: { feats: true, grantedSpells: {include: {Spell: true}}},
        });
        if (!leveledClass) {throw new Error("Class not found");}
        if (!character) throw new Error("Character not found");
        if (!character.classLevels) {character.classLevels = [];}


        const existingIndex = character.characterClasses.findIndex(cls => cls.id === leveledClass.id);
        if (existingIndex === -1) {
          character.characterClasses.push(leveledClass);
          character.classLevels.push(1);
          character.armorProfs = Array.from(new Set([...(character.armorProfs ?? []), ...leveledClass.armorTraining]));

          const existingProperties = new Set(
          character.weaponProficiencies
            .filter((prof) => prof.property !== null)
            .map((prof) => prof.property)
          );
          const newPropertiesToAdd = leveledClass.weaponProfs.filter(
            (prop) => !existingProperties.has(prop)
          );
          await ctx.prisma.characterWeaponProficiency.createMany({
            data: newPropertiesToAdd.map((property) => ({
              characterId: character.id,
              property,
            })),
            skipDuplicates: true,
          });
        } 
        else {
          character.classLevels[existingIndex] = (character.classLevels[existingIndex] ?? 0) + 1;
        }


        const index = character.characterClasses.findIndex((cls) => cls.id === input.leveledClassId);
        type HitDie = { num: number; faces: number };
        //character.classLevels = [...character.classLevels];
        const updatedHitDice = Array.isArray(character.hitDice) ? [...(character.hitDice as HitDie[])] : [];
        character.maxHitPoints = (character?.maxHitPoints??0)+Math.floor(Math.random() * (leveledClass?.hitDiceType - 1) + 1)+(character?.abilityScores[2]??0);
        if (index !== -1) {
          //if(character.classLevels[index]){character.classLevels[index]++;}

          if (updatedHitDice[index]) {
            updatedHitDice[index].num++;
          } 
          else {
            updatedHitDice[index] = {
              num: 1,
              faces: leveledClass.hitDiceType ?? 6,
            };
          }
        } 
        else {
          character.classLevels.push(1);
          updatedHitDice.push({
            num: 1,
            faces: leveledClass.hitDiceType ?? 6,
          });
        }
        character.hitDice = updatedHitDice;
        //character.level = character.classLevels.reduce((sum, lvl) => sum + lvl, 0);
        character.level+=1;
        const levelMatches = (feat: { gainedAtLevel: number | null }) =>
          (feat.gainedAtLevel ?? 1) === character.level;

        const newSpeciesFeats = character?.species?.feats?.filter(levelMatches) ?? [];
        const newBackgroundFeats = character?.background?.feats?.filter(levelMatches) ?? [];
        const newClassFeats = character?.characterClasses
          .flatMap(cls => cls?.feats ?? [])
          .filter(levelMatches);

        character.feats = [...(character?.feats ?? []), ...newSpeciesFeats, ...newBackgroundFeats, ...newClassFeats];
        const getProfBonus = (level:number) => {
          if(level<5) {return 2;}
          else if(level<9) {return 3;}
          else if(level<13) {return 4;}
          else if(level<17) {return 5;}
          else if(level<=20) {return 6;}
        };
        character.proficiencyBonus = (getProfBonus(character.level)??2);


        const spellcastingClasses = character.characterClasses
          .map((cls, index) => ({ cls, index }))
          .filter(({ cls }) => cls.grantsSpellcasting);
        if(spellcastingClasses.length>1) {
          const spellLevel = calculateMultiClassSpellSlotLevel(character?.characterClasses, character?.classLevels);
          character.spellSlots = (multiclassSpellSlots[spellLevel-1]??[]);

          character.spellsPreparedNum = spellcastingClasses.reduce((sum, { cls, index }) => {
          const classLevel = character.classLevels?.[index] ?? 0;
          const preparedArray = cls.spellsPrepared ?? [];
          const preparedAtLevel = preparedArray[classLevel - 1] ?? 0;
          return sum + preparedAtLevel;
        }, 0);

         character.knownCantripsNum = spellcastingClasses.reduce((sum, { cls, index }) => {
          const classLevel = character.classLevels?.[index] ?? 0;
          const cantripsArray = cls.knownCantripsNum ?? [];
          const cantripsAtLevel = cantripsArray[classLevel - 1] ?? 0;
          return sum + cantripsAtLevel;
        }, 0);

          const spellAbilityIndex = abilityIndexMap[spellcastingClasses.at(0)?.cls.spellAbility??Ability.Intelligence];
          const spellScore = character.abilityScores[spellAbilityIndex];
          character.spellSaveDC =  8 + Math.floor(((spellScore??12) - 10) / 2) + (character.proficiencyBonus??2);
          character.spellAbility = (spellcastingClasses?.at(0)?.cls.spellAbility??Ability.Intelligence);
        }
        else if(spellcastingClasses.length==1) {
          const spellcastingClass = character?.characterClasses.find(cls=> cls.grantsSpellcasting==true);
          const index = character.characterClasses.findIndex((cls) => cls.id === spellcastingClass?.id);
          const classLevel = character.classLevels?.[index];
          if (spellcastingClass?.spellSlots && Array.isArray(spellcastingClass.spellSlots) && typeof classLevel === 'number' && spellcastingClass.spellSlots.length >= classLevel) {
              character.spellSlots = ((spellcastingClass.spellSlots as unknown as number[][])[classLevel - 1]??[]);
          }
          character.spellsPreparedNum = (spellcastingClass?.spellsPrepared[Number(classLevel)-1]??0);
          character.knownCantripsNum = (spellcastingClass?.knownCantripsNum[Number(classLevel)-1]??0);
          const spellAbilityIndex = abilityIndexMap[(spellcastingClass?.spellAbility??Ability.Intelligence)];
          const spellScore = character.abilityScores[spellAbilityIndex];
          character.spellSaveDC =  8 + Math.floor(((spellScore??12) - 10) / 2) + (character.proficiencyBonus??2);
          character.spellAbility = (spellcastingClass?.spellAbility??Ability.Intelligence);
        }

        // Initialize or reuse spellsKnown
        const knownSpells = new Map<number, typeof character.spellsKnown[number]>();
        (character.spellsKnown ?? []).forEach(spell => {
          knownSpells.set(spell.id, spell);
        });

        // Add granted spells from species and background if level matches
        [character.species, character.background].forEach(source => {
          source?.grantedSpells?.forEach(gs => {
            if (gs.level === character.level && gs.Spell && !knownSpells.has(gs.Spell.id)) {
              knownSpells.set(gs.Spell.id, gs.Spell);
            }
          });
        });

        // Add granted spells from class if class level matches
        const classLevelIndex = character.characterClasses.findIndex(cls => cls.id === input.leveledClassId);
        const classLevel = character.classLevels[classLevelIndex] ?? 0;
        leveledClass.grantedSpells?.forEach(gs => {
          if (gs.level === classLevel && gs.Spell && !knownSpells.has(gs.Spell.id)) {
            knownSpells.set(gs.Spell.id, gs.Spell);
          }
        });

        // Apply final list to character.spellsKnown
        character.spellsKnown = Array.from(knownSpells.values());



        character.hitDice = character.hitDice.filter((hd): hd is { num: number; faces: number } => hd !== undefined);
        await ctx.prisma.character.update({
          where: { id: input.charId },
          data: {
            classLevels: character.classLevels,
            hitDice: character.hitDice,
            maxHitPoints: character.maxHitPoints,
            characterClasses: {
              connect: index === -1 ? { id: input.leveledClassId } : undefined,
            },
            level: character.level,
            feats: { set: character.feats.map(f => ({ id: f.id })),},
            proficiencyBonus: character.proficiencyBonus,
            spellSlots: character.spellSlots,
            knownCantripsNum: character.knownCantripsNum,
            spellsPreparedNum: character.spellsPreparedNum,
            spellSaveDC: character.spellSaveDC,
            currentSpellSlots: character.spellSlots,
            spellsKnown: {
              set: character.spellsKnown.map(spell => ({ id: spell.id })),
            },
          },
        });
      }),

    updateAbiliityScores: publicProcedure
    .input(z.object({charId: z.number(), newScores: z.array(z.number())}))
    .mutation(async ({ctx,input})=> {
      return await ctx.prisma.character.update({where: {id: input.charId}, data: {abilityScores: input.newScores}});
    }),

    deleteAttack: publicProcedure
    .input(z.object({attackId: z.number()}))
    .mutation(async ({ctx,input})=> {
      return await ctx.prisma.attack.delete({where: {id: input.attackId}});
    }),
});
