import { useRouter } from "next/router";
import { api } from "../../utils/api";
import type { Attack, Item, Spell } from "@prisma/client";
import {Ability} from "@prisma/client"
import {useEffect, useState} from "react";
import React from "react";
import type { z } from "zod";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { EditableAttack } from "../../components/editableattack";

type DamageDice = {
  num: number;
  type: number;
};
type Props = {
  attack: Attack;
  onSave: (updated: Attack) => void;
};

export default function InteractiveSheet()
{
    const router = useRouter();
    const { charId } = router.query;
    const numericCharId = typeof charId === "string" ? Number(charId) : Array.isArray(charId) ? Number(charId[0]) : undefined;
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
    
    const { mutateAsync: addItem } = api.interactiveSheet.addItem.useMutation();
    const {mutateAsync: deleteItem} = api.interactiveSheet.deleteItem.useMutation();
    const {mutateAsync: updateAttacks} = api.interactiveSheet.updateAttacks.useMutation();
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
    const {
      data: availableSpells,
      refetch: refetchAvailableSpells
    } = api.interactiveSheet.getAvailableSpells.useQuery({ charId: Number(charId) });
    const {mutateAsync: learnSpell} = api.interactiveSheet.learnSpell.useMutation();
    const { mutateAsync: prepareSpell } =
      api.interactiveSheet.prepareSpell.useMutation();
    const { mutateAsync: unprepareSpell } =
      api.interactiveSheet.unprepareSpell.useMutation();
    const { mutateAsync: SpellSlotMutation } =
      api.interactiveSheet.useSpellSlot.useMutation(); // You'll need to define this
      
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
    const spellLevels = Array.from({ length: 10 }, (_, i) => i); // 0–9
   
    if (isLoadingChar) return <p>Loading...</p>;
    if (isErrorChar || !character) return <p>Error loading character</p>;
    if (items?.length==0) return <p>Error loading items. Items array length is 0</p>;

    return <>
    <p>{character.name}</p>
    <button onClick={handleItemButtonClick} className="btn">
      {showItems ? 'Hide Items' : 'Show Items'}
    </button>
    <button onClick={handleInventoryButtonClick} className="btn">
      {showInventory ? 'Hide Inventory' : 'Show Inventory'}
    </button>
    <button onClick={handleSpellsButtonClick} className="btn">
        {showSpells ? "Hide Available Spells" : "Show Available Spells"}
    </button>
    <button onClick={handleShowAttacksButtonClick} className="btn">
      {showAttacks ? 'Hide Attacks' : 'Show Attacks'}
    </button>
    {isLoadingItems && <p>Loading Items...</p>}
    {isErrorItems && <p>Failed to load items.</p>}
    {showItems && (
      <ul className="space-y-6">
      {items?.map((item: Item) => (
        <li key={item.id}>
          <p>{item.name}</p>
          <button onClick={()=>handleAddItemButtonClick(item.id)}>Add item</button>
        </li>
      ))}
      </ul>)}
    {showInventory && (
      <ul className="space-y-6">
      {character.characterItems?.map((charItem: Item) => (
        <li key={charItem.id}>
          <p>{charItem.name}</p>
          <p>{charItem.description}</p>
          <button onClick={()=>handleDeleteItemButtonClick(charItem.id)}>Delete Item</button>
        </li>
      ))}
      </ul>)}

      {showAttacks && (
        <ul className="space-y-6">
          {attacksData?.map((attack: Attack) => (
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
      )}
      {showSpells && (
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
                Prepare
              </button>
            </div>
          ))}
        </div>
      )}
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
       <div>
        <h2 className="text-xl font-semibold">Prepared Spells</h2>
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
      <ul>
                {character.feats.map((feat)=>(
                  <li key={feat?.id}>
                    <p>{feat?.name}</p>
                    <p>{feat?.description}</p>
                  </li>
                ))}
              </ul>
    </>

}