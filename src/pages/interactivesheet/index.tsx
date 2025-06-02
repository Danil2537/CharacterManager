import { useRouter } from "next/router";
import { api } from "../../utils/api";
import type { Attack, Class, Item, Spell } from "@prisma/client";
import {Ability, Skill} from "@prisma/client"
import {useEffect, useState} from "react";
import React from "react";
import type { z } from "zod";
import { EditableAttack } from "../../components/editableattack";
import Link from "next/link";

type HitDie = {
  num: number;
  faces: number;
};

export default function InteractiveSheet()
{
    const router = useRouter();
    const { charId } = router.query;
    // const numericCharId = typeof charId === "string" ? Number(charId) : Array.isArray(charId) ? Number(charId[0]) : undefined;
    const enabled = !isNaN(typeof charId === "string" ? Number(charId) : Array.isArray(charId) ? Number(charId[0]) : NaN);
    const {
      data: character,
      isLoading: isLoadingChar,
      isError: isErrorChar,
      refetch: refetchCharacter
    } = api.interactiveSheet.getCharacter.useQuery({ charId: Number(charId) }, { enabled: !!charId });
    const {
      data: items,
      isLoading: isLoadingItems,
      isError: isErrorItems,
      refetch: refetchItems
    } = api.interactiveSheet.getAllItems.useQuery({ charId: Number(charId) });
    const {
      data: attacksData,
      isLoading: isLoadingAttacks,
      isError: isErrorAttacks,
      refetch: refetchAttacks
    } = api.interactiveSheet.getCharAttacks.useQuery({charId: Number(charId)}, { enabled });


    const { data: classes,  isLoading: isLoadingClasses,
      isError: isErrorClasses, } = api.interactiveSheet.getAllClasses.useQuery();

    const { mutateAsync: levelUpMutation } = api.interactiveSheet.levelUp.useMutation();

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    const handleLevelUp = async () => {
      if (!character?.id || !selectedClassId) return;

      try {
        await levelUpMutation({ charId: character.id, leveledClassId: selectedClassId });
        await refetchCharacter();
      } catch (err) {
        console.error("Level up failed:", err);
      }
    }
    
    const { mutateAsync: addItem } = api.interactiveSheet.addItem.useMutation();
    const {mutateAsync: deleteItem} = api.interactiveSheet.deleteItem.useMutation();
    const {mutateAsync: updateAttacks} = api.interactiveSheet.updateAttacks.useMutation();
    const {mutateAsync: addAttack} = api.interactiveSheet.createAttack.useMutation();
    const {mutateAsync: deleteAttack} = api.interactiveSheet.deleteAttack.useMutation();
    const [localAttacks, setLocalAttacks] = useState<Attack[] | undefined>(attacksData);
    useEffect(() => {
      setLocalAttacks(attacksData);
    }, [attacksData]);

    
    const [showItems, setShowItems] = useState(false);
    const handleItemButtonClick = () =>{setShowItems(!showItems);};
    const [showInventory, setShowInventory] = useState(false);
    const [showAttacks, setShowAttacks] = useState(false);
    const handleInventoryButtonClick = () =>{setShowInventory(!showInventory);};    
    const handleAddItemButtonClick = (itemId: number) => {
    const data = { charId: character?.id ?? 0, itemId: itemId ?? 0 };
    if (data.charId === 0 || data.itemId === 0) return;
    addItem(data)
      .then(() => refetchCharacter())
      .catch(err => console.error("Error adding item:", err));
    };
    const handleDeleteItemButtonClick = (itemId: number) => {
      deleteItem({itemId: itemId}).then(()=>refetchItems())
      .catch(err => console.error("Error deleting item (client): ",err));
    };
    const handleShowAttacksButtonClick = () => {setShowAttacks(!showAttacks);};
    const handleAddAttackButtonClick = async (charid: number) => {
              if (!localAttacks) return;
              await addAttack({charId: charid});
              await refetchAttacks();
    };
    const {
      data: availableSpells,
      refetch: refetchAvailableSpells
    } = api.interactiveSheet.getAvailableSpells.useQuery({ charId: Number(charId) });
    const {mutateAsync: learnSpell} = api.interactiveSheet.learnSpell.useMutation();
    const { mutateAsync: prepareSpell } = api.interactiveSheet.prepareSpell.useMutation();
    const { mutateAsync: unprepareSpell } = api.interactiveSheet.unprepareSpell.useMutation();
    const { mutateAsync: SpellSlotMutation } = api.interactiveSheet.useSpellSlot.useMutation();
    const {mutateAsync: updateHP} = api.interactiveSheet.updateHitPoints.useMutation();
    const {mutateAsync: updateScores} = api.interactiveSheet.updateAbilityScores.useMutation();
      
    const [showSpells, setShowSpells] = useState(false);
    const handleSpellsButtonClick = () => setShowSpells(!showSpells);
    const handlePrepareSpellClick = async (spellId: number) => {
      if (!character?.id) return;
      try {
        await prepareSpell({ charId: character.id, spellId });
        await refetchCharacter();
      } catch (error) {
        console.error("Failed to prepare spell:", error);
      }
    };
    const currentPrepared = character?.spellsPrepared.filter((spell) => spell.level > 0).length;
    const canPrepareMore = (currentPrepared??0) < (character?.spellsPreparedNum ?? 1);
    const spellLevels = Array.from({ length: 10 }, (_, i) => i); 

    const [currentTab, setCurrentTab] = useState(0);
    const handleTabClick = (tab:number) => { setCurrentTab(tab);};
    const handleUpdateHP = async (currentHitPoints: number, maxHitPoints: number) => {
      try {
        await updateHP({ charId: Number(charId), curHP: currentHitPoints, maxHP: maxHitPoints });
        await refetchCharacter();
      } catch (error) {
        console.error("Failed to update HP:", error);
      }
    };
    const [curHP, setCurHp] = useState<number>(0);
    const [maxHP, setMaxHp] = useState<number>(0);
    useEffect(() => {
      if (character) {
        setCurHp((character?.currentHitPoints??0));
        setMaxHp((character.maxHitPoints??0));
      }
    }, [character]);
    const [scores, setScores] = useState<Array<number>>((character?.abilityScores??[]));
    useEffect(()=> {
      if(character) {
        setScores((character?.abilityScores));
      }
    }, [character]);
    const handleUpdateScores = async (scores: any) => {
      try {
        await updateScores({ charId: Number(charId), newScores: scores });
        await refetchCharacter();
      } catch (error) {
        console.error("Failed to update HP:", error);
      }
    };
    const [hitDiceUsage, setHitDiceUsage] = useState<{ [key: string]: boolean[] }>({});
    useEffect(() => {
      if (character?.hitDice && Array.isArray(character.hitDice)) {
        const initialUsage: { [key: string]: boolean[] } = {};

        (character.hitDice as HitDie[]).forEach((hd, idx) => {
          if (typeof hd.num === "number" && typeof hd.faces === "number") {
            const key = `${hd.faces}-${idx}`;
            initialUsage[key] = Array(hd.num).fill(false);
          }
        });

        setHitDiceUsage(initialUsage);
      }
    }, [character?.hitDice]);
    const { mutateAsync: shortRest } = api.interactiveSheet.shortRest.useMutation();
    const { mutateAsync: longRest } = api.interactiveSheet.longRest.useMutation();
    const {mutateAsync: updateCharData} = api.interactiveSheet.updateCharData.useMutation();

    const handleShortRest = async () => {
        if (!character?.id) return;

        const usedDice: { [faces: number]: number } = {};

        Object.entries(hitDiceUsage).forEach(([key, usage]) => {
          const [facesStr] = key.split("-");
          const faces = Number(facesStr);
          const usedCount = usage.filter(Boolean).length;

          if (usedCount > 0) {
            usedDice[faces] = (usedDice[faces] ?? 0) + usedCount;
          }
        });

        const hitDiceToSend = Object.entries(usedDice).map(([facesStr, num]) => ({
          num,
          faces: Number(facesStr),
        }));

        try {
          await shortRest({ charId: character.id, hitDice: hitDiceToSend });
          await refetchCharacter();
        } catch (error) {
          console.error("Short rest failed:", error);
        }
    };
    const handleLongRest = async () => {
      if (!character?.id) return;
      await longRest({charId: character.id});
    };

    const [charData, setCharData] = useState<Array<number>>(([(character?.armorClass??10), (character?.initiative??0), (character?.speed??30), (character?.exhaustionLevel??0), (character?.proficiencyBonus??2)]));
    useEffect(()=> {
      if(character) {
        setCharData(([(character?.armorClass??10), (character?.initiative??0), (character?.speed??30), (character?.exhaustionLevel??0), (character?.proficiencyBonus??2)]));
      }
    }, [character]);

    const handleUpdateChardata = async (chardata: any[]) => {
      if(!character?.id) return;
      await updateCharData({charId: character.id, armor: chardata[0],  initiative: chardata[1], speed: chardata[2],exhaustion: chardata[3], profBonus: chardata[4]});
    }

    const modifier = (score: number) => {
      return Math.floor((score-10)/2);
    };

    const savingThrow = (score: number, isProficient: boolean, profBonus: number): number => {
      return modifier(score) + (isProficient ? profBonus : 0);
    }
    const skill = (score: number, isProficient: boolean, profBonus: number): number => {
      return modifier(score) + (isProficient ? profBonus : 0);
    }

    if (isLoadingChar) return <p>Loading...</p>;
    if (isErrorChar || !character) return <p>Error loading character</p>;
    if (items?.length==0) return <p>Error loading items. Items array length is 0</p>;



    return <>
<div className="flex flex-col h-screen w-screen">
  <div className="bg-gray-800 text-white p-4 shadow-md flex flex-wrap gap-x-6 items-center rounded-md">
      <Link className="flex items-center p-2 mr-10 border-1 border-solid rounded-lg shadow-md hover:bg-white hover:text-black hover:transition duration-400 ease-in-out" href="/">
        <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 2.75C12.22 2.75 12.41 2.85 12.55 3C12.67 3.13 12.75 3.31 12.75 3.5C12.75 3.91 12.41 4.25 12 4.25C11.59 4.25 11.25 3.91 11.25 3.5C11.25 3.31 11.33 3.13 11.45 3C11.59 2.85 11.78 2.75 12 2.75ZM19 19H5V5H19V19ZM12 6C10.35 6 9 7.35 9 9C9 10.65 10.35 12 12 12C13.65 12 15 10.65 15 9C15 7.35 13.65 6 12 6ZM6 16.47V18H18V16.47C18 13.97 14.03 12.89 12 12.89C9.97 12.89 6 13.96 6 16.47Z" fill="inherit"></path>
        </svg>
        <span className="pl-2">Мої персонажі</span>
      </Link>
      <h1 className="text-xl font-bold">{character.name}</h1>
      <h2 className="text-lg">{character?.species?.name}</h2>
      <h2 className="text-lg">{character?.background?.name}</h2>
      <h3 className="text-lg">Level {character.level}</h3>
      <ul className="flex gap-x-4">
        {character.characterClasses?.map((cls,i) => (
          <li key={cls.class.id} className="text-sm bg-gray-700 px-2 py-1 rounded">
          <span className="text-gray-300">{cls.class.name} {cls.classLevels}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <label className="text-lg">Cur.HP:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(curHP??0)}
          onChange={(e) => setCurHp(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-lg">Max.HP:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(maxHP??0)}
          onChange={(e) => setMaxHp(Number(e.target.value))}
        />
      </div>
      <button className="text-lg" onClick={()=>handleUpdateHP((curHP??10), (maxHP??0))}>Update HP</button>
      <div className="flex items-center gap-2">
        <label className="text-lg">Armor Class:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={charData[0]}
          onChange={(e) => {
            const newData = [...charData]; 
            newData[0] = Number(e.target.value); 
            setCharData(newData); 
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg">Initiative:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={charData[1]}
          onChange={(e) => {
            const newData = [...charData]; 
            newData[1] = Number(e.target.value); 
            setCharData(newData); 
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg">Speed:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={charData[2]}
          onChange={(e) => {
            const newData = [...charData]; 
            newData[2] = Number(e.target.value); 
            setCharData(newData); 
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg">Exhaustion:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={charData[3]}
          onChange={(e) => {
            const newData = [...charData]; 
            newData[3] = Number(e.target.value); 
            setCharData(newData); 
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-lg">Prof. Bonus:</label>
        <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={charData[4]}
          onChange={(e) => {
            const newData = [...charData]; 
            newData[4] = Number(e.target.value); 
            setCharData(newData); 
          }}
        />
      </div>

      <button
        className="text-lg px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        onClick={() =>
          handleUpdateChardata(charData)}
      >
        Update Character Data
      </button>
  </div>

  <div className="flex flex-1 overflow-hidden">  
    <div className="w-1/2 bg-gray-100 p-4 overflow-auto">
    <button className="text-lg" onClick={()=>handleUpdateScores(scores)}>Update Ability Scores</button>
      <ul>
        <li>Strength: 
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[0]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[0] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[0]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[0]??0, character.savingThrows.includes(Ability.Strength), character.proficiencyBonus ?? 0)
          } 
          <ul>
            <li>Athletics: {skill(character.abilityScores[0]??0, character.skillProfs.includes(Skill.Athletics), character.proficiencyBonus??0)}</li>
          </ul>       
        </li>
        <li>Dexterity:           
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[1]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[1] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[1]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[1]??0, character.savingThrows.includes(Ability.Dexterity), character.proficiencyBonus ?? 0)
          } 
          <ul>
            <li>Acrobatics: {skill(character.abilityScores[1]??0, character.skillProfs.includes(Skill.Acrobatics), character.proficiencyBonus??0)}</li>
            <li>Sleight of Hand: {skill(character.abilityScores[1]??0, character.skillProfs.includes(Skill.SleightOfHand), character.proficiencyBonus??0)}</li>
            <li>Stealth: {skill(character.abilityScores[1]??0, character.skillProfs.includes(Skill.Stealth), character.proficiencyBonus??0)}</li>
          </ul>       
        </li>
        <li>Constitution:
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[2]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[2] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[2]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[2]??0, character.savingThrows.includes(Ability.Constitution), character.proficiencyBonus ?? 0)
          }       
        </li>
        <li>Intelligence:           
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[3]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[3] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[3]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[3]??0, character.savingThrows.includes(Ability.Intelligence), character.proficiencyBonus ?? 0)
          } 
          <ul>
            <li>Arcana: {skill(character.abilityScores[3]??0, character.skillProfs.includes(Skill.Arcana), character.proficiencyBonus??0)}</li>
            <li>History: {skill(character.abilityScores[3]??0, character.skillProfs.includes(Skill.History), character.proficiencyBonus??0)}</li>
            <li>Investigation: {skill(character.abilityScores[3]??0, character.skillProfs.includes(Skill.Investigation), character.proficiencyBonus??0)}</li>
            <li>Nature: {skill(character.abilityScores[3]??0, character.skillProfs.includes(Skill.Nature), character.proficiencyBonus??0)}</li>
            <li>Religion: {skill(character.abilityScores[3]??0, character.skillProfs.includes(Skill.Religion), character.proficiencyBonus??0)}</li>
          </ul>       
        </li>
        <li>Wisdom:           
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[4]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[4] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[4]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[4]??0, character.savingThrows.includes(Ability.Wisdom), character.proficiencyBonus ?? 0)
          } 
          <ul>
            <li>Animal Handling: {skill(character.abilityScores[4]??0, character.skillProfs.includes(Skill.AnimalHandling), character.proficiencyBonus??0)}</li>
            <li>Insight: {skill(character.abilityScores[4]??0, character.skillProfs.includes(Skill.Insight), character.proficiencyBonus??0)}</li>
            <li>Medicine: {skill(character.abilityScores[4]??0, character.skillProfs.includes(Skill.Medicine), character.proficiencyBonus??0)}</li>
            <li>Perception: {skill(character.abilityScores[4]??0, character.skillProfs.includes(Skill.Perception), character.proficiencyBonus??0)}</li>
            <li>Survival: {skill(character.abilityScores[4]??0, character.skillProfs.includes(Skill.Survival), character.proficiencyBonus??0)}</li>
          </ul>       
        </li>
        <li>Charisma:           
          <input
          type="number"
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          value={(scores[5]??0)}
          onChange={(e) => {
            const newScores = [...scores]; 
            newScores[5] = Number(e.target.value); 
            setScores(newScores); 
          }}
          />
          Check: {modifier(character?.abilityScores[5]??0)}
          Saving Throw: {
            savingThrow(character.abilityScores[5]??0, character.savingThrows.includes(Ability.Charisma), character.proficiencyBonus ?? 0)
          } 
          <ul>
            <li>Deception: {skill(character.abilityScores[5]??0, character.skillProfs.includes(Skill.Deception), character.proficiencyBonus??0)}</li>
            <li>Intimidation: {skill(character.abilityScores[5]??0, character.skillProfs.includes(Skill.Intimidation), character.proficiencyBonus??0)}</li>
            <li>Performance: {skill(character.abilityScores[5]??0, character.skillProfs.includes(Skill.Performance), character.proficiencyBonus??0)}</li>
            <li>Persuasion: {skill(character.abilityScores[5]??0, character.skillProfs.includes(Skill.Persuasion), character.proficiencyBonus??0)}</li>
          </ul>       
        </li>
      </ul>
      <h2>Weapon Proficiencies</h2>
      <ul>
        {character.weaponProficiencies.map((wp, index) => (
          <li key={wp.id ?? index}>
            {wp.weapon
              ? `Weapon: ${wp.weapon.name}`
              : wp.property
              ? `Property: ${wp.property}`
              : 'Unknown Proficiency'}
          </li>
        ))}
      </ul>
      <h3>Armor Proficiencies</h3>
      <ul>
        {character.armorProfs.map((armor, index) => (
          <li key={index}>{armor}</li>
        ))}
      </ul>
      <h3>Known Languages</h3>
      <ul>
        {character.knownLanguage.map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
    </div>
    <div className="w-1/2 flex flex-col border-l border-gray-300 overflow-hidden">
    <div className="bg-gray-200 p-4 border-b border-gray-300">
      <div className="flex flex-wrap items-center gap-6">
        <button
          onClick={handleLongRest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Long Rest
        </button>

        <button
          onClick={handleShortRest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Short Rest
        </button>
        <div className="flex flex-wrap items-center gap-4">
          {(character.hitDice as HitDie[])?.map((hd, idx) => {
            if (typeof hd.num !== "number" || typeof hd.faces !== "number") return null;

            const key = `${hd.faces}-${idx}`;
            const checkboxes = hitDiceUsage[key] ?? [];

            return (
              <div key={key} className="flex items-center gap-1">
                <span className="font-semibold">{hd.num}d{hd.faces}:</span>
                {checkboxes.map((used, i) => (
                  <input
                    key={i}
                    type="checkbox"
                    className="mr-1"
                    checked={used}
                    onChange={() => {
                      const updated = [...checkboxes];
                      updated[i] = !updated[i];
                      setHitDiceUsage(prev => ({ ...prev, [key]: updated }));
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
        {isLoadingClasses && <p>Loading classes...</p>}
        {isErrorClasses && <p>Error loading classes.</p>}
        {classes && (
          <div className="flex items-center gap-2">
            <select
              className="border p-2 rounded max-w-xs"
              value={selectedClassId ?? ""}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
            >
              <option value="" disabled>Select a class</option>
              {classes.map((cls: Class) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleLevelUp}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={!selectedClassId}
            >
              Level Up
            </button>
          </div>
        )}
      </div>
    </div>

      <div className="flex bg-white border-b border-gray-300">
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(0)}>Attacks</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(1)}>Inventory</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(2)}>Items</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(3)}>Available Spells</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(4)}>Known Spells</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(5)}>Prepared Spells</button>
        <button className="px-4 py-2 border-r border-gray-200 hover:bg-gray-100" onClick={()=>handleTabClick(6)}>Features</button>
      </div>
     {currentTab===0 && (
<div className="space-y-4">
    <div className="flex gap-2">
    <button
            className="btn btn-sm px-3"
            onClick={()=>handleAddAttackButtonClick(character.id)}
          >
            +
          </button>

      <button
        className="btn btn-sm px-3"
        onClick={async () => {
          if (!localAttacks || localAttacks.length === 0) return;
          const lastAttack = localAttacks[localAttacks.length - 1];
          try {
            await deleteAttack({ attackId: (lastAttack?.id??0) });
            await refetchAttacks();
            await refetchCharacter();
          } catch (err) {
            console.error("Error deleting attack:", err);
          }
        }}
      >
        -
      </button>
    </div>

    <ul className="space-y-6">
      {localAttacks?.map((attack: Attack) => (
        <li key={attack.id}>
          <EditableAttack
            attack={attack}
            onSave={async (updated) => {
              try {
                await updateAttacks({ attack: updated });
                await refetchAttacks();
                await refetchCharacter();
              } catch (err) {
                console.error("Error updating attack:", err);
              }
            }}
          />
        </li>
      ))}
    </ul>
  </div>  
     )}
     {currentTab===1 && (
      <ul className="space-y-6">
      {character.characterItems?.map((charItem: Item) => (
        <li key={charItem.id}>
          <p>{charItem.name}</p>
          <p>{charItem.description}</p>
          <button onClick={()=>handleDeleteItemButtonClick(charItem.id)}>Delete Item</button>
        </li>
      ))}
      </ul> 
     )}
     {currentTab===2 && (
      <ul className="space-y-6">
      {items?.map((item: Item) => (
        <li key={item.id}>
          <p>{item.name}</p>
          <button onClick={()=>handleAddItemButtonClick(item.id)}>Add item</button>
        </li>
      ))}
      </ul>
     )}
     {currentTab===3 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Available Spells</h2>
          {availableSpells?.map((spell: Spell) => (
            <div key={spell.id} className="border p-2 rounded-md">
              <p className="font-bold">{spell.name}</p>
              <p>Level: {spell.level}</p>
              <p>{spell.description}</p>
              <button
                className="btn mt-2"
                onClick={async () => {
                    await learnSpell({ charId: character.id, spellId: spell.id });
                    await refetchCharacter();
                    await refetchAvailableSpells();
                }
                }
              >
                Learn
              </button>
            </div>
          ))}
        </div>
      )}
     {currentTab===4 && (
      <>
<h2 className="mt-6 font-bold text-lg">Known Spells</h2>
      <ul className="space-y-6">
        {character.spellsKnown.length === 0 && <p>No known spells.</p>}
        {character.spellsKnown.map((spell: Spell) => {
        const isPrepared = character.spellsPrepared.some((s) => s.id === spell.id);
        const isCantrip = spell.level === 0;

        return (
          <li key={spell.id}>
            <p className="font-bold">{spell.name}</p>
            <p>Level: {spell.level}</p>
            <p>{spell.description}</p>
            <button
              onClick={() => handlePrepareSpellClick(spell.id)}
              disabled={isPrepared || (!isCantrip && !canPrepareMore)}
              className={(isPrepared || (!isCantrip && !canPrepareMore)) ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPrepared ? "Prepared" : "Prepare"}
            </button>
          </li>
        );
      })}
      </ul>
      </>
     )}
     {currentTab===5 && (
      <>
       <div>
        <h2 className="text-xl font-semibold">Prepared Spells</h2>
        <h3>Spell Save DC: {character.spellSaveDC}</h3>
        <p>
          Prepared (non-cantrips): {currentPrepared} / {character.spellsPreparedNum}
        </p>

        {spellLevels.map((level) => {
          const spells = character.spellsPrepared.filter((s) => s.level === level);
          if (spells.length === 0) return null;

          const slotInfo =
            level > 0
              ? `Slots: ${character.currentSpellSlots[level - 1]}/${character.spellSlots[level - 1]}`
              : "Cantrip";

          return (
            <div key={level} className="mt-4">
              <h3 className="font-bold text-md">
                Level {level} – {slotInfo}
              </h3>
              <ul className="pl-4 space-y-2">
                {spells.map((spell) => (
                  <li key={spell.id} className="border rounded p-2">
                    <p className="font-bold">{spell.name}</p>
                    <p>{spell.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn"
                        onClick={() =>
                          unprepareSpell({ charId: character.id, spellId: spell.id })
                            .then(() => refetchCharacter())
                        }
                      >
                        Unprepare
                      </button>
                      {level > 0 && (character?.currentSpellSlots[level - 1]??0) > 0 && (
                        <button
                          className="btn"
                          onClick={() =>
                            SpellSlotMutation({ charId: Number(character.id), spellLevel: Number(level) })
                              .then(() => refetchCharacter())
                              .catch((err) => console.error("Error using spell slot:", err))
                          }
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      </>
     )}
     {currentTab===6 && (
      <>
      <ul>
        {character.feats.map((feat)=>(
          <li key={feat?.id}>
            <p>{feat?.name}</p>
            <p>{feat?.description}</p>
            </li>
          ))}
      </ul>
      </>
     )}
    </div>
  </div>
</div>
  </>
}