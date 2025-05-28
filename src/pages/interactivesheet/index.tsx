import { useRouter } from "next/router";
import { api } from "../../utils/api";
import type { Item, Spell } from "@prisma/client";
import {useState} from "react";
import React from "react";
export default function InteractiveSheet()
{
    const router = useRouter();
    const { charId } = router.query;
    const { data: character, isLoading: isLoadingChar, isError: isErrorChar } = api.interactiveSheet.getCharacter.useQuery({ charId: Number(charId) },{enabled: !!charId,});
    const {data:items, isLoading: isLoadingItems, isError: isErrorItems} = api.interactiveSheet.getAllItems.useQuery({charId: Number(charId)});
    const { mutateAsync: addItem } = api.interactiveSheet.addItem.useMutation();
    const [showItems, setShowItems] = useState(false);
    const handleItemButtonClick = () =>{setShowItems(!showItems);};
    const [showInventory, setShowInventory] = useState(false);
    const handleInventoryButtonClick = () =>{setShowInventory(!showInventory);};    
    const handleAddItemButtonClick = (itemId: number) => {
      const data = {charId: character?.id??0, itemId: itemId??0};
      if(data.charId==0 || data.itemId==0)
      {
        return <p>Error when trying to add an item to the character. Either character or item id is null or undefined</p>;
      }
      addItem(data).catch(err => console.error("Error adding item:", err));
    };
    const { data: availableSpells } =
    api.interactiveSheet.getAvailableSpells.useQuery({
      charId: Number(charId),
    });
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
        router.reload(); // Reload to update spellPrepared list
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
    <button onClick={handleItemButtonClick}>
      {showItems ? 'Hide Items' : 'Show Items'}
    </button>
        <button onClick={handleInventoryButtonClick}>
      {showItems ? 'Hide Inventory' : 'Show Inventory'}
    </button>
    <button onClick={handleSpellsButtonClick} className="btn">
        {showSpells ? "Hide Available Spells" : "Show Available Spells"}
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
      {character.characterItems?.map((charItem: any) => (
        <li key={charItem.item.id}>
          <p>{charItem.item.name}</p>
          <p>{charItem.item.description}</p>
        </li>
      ))}
      </ul>)}
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
                onClick={() =>
                learnSpell({ charId: character.id, spellId: spell.id }).then(() => router.reload())
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
                          unprepareSpell({ charId: character.id, spellId: spell.id }).then(() =>
                            router.reload()
                          )
                        }
                      >
                        Unprepare
                      </button>
                      {level > 0 && (character?.currentSpellSlots[level - 1]??0) > 0 && (
                        <button
                          className="btn"
                          onClick={() =>
                          SpellSlotMutation({ charId: Number(character.id), spellLevel: Number(level) })
                            .then(() => router.reload())
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

}