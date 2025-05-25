import { useRouter } from "next/router";
import { api } from "../../utils/api";
import type { CharacterItems, Item, Spell } from "@prisma/client";
import {useState} from "react";
export default function InteractiveSheet()
{
    const router = useRouter();
    const { charId } = router.query;
    console.log(`char id ${charId}`);
    const { data: character, isLoading: isLoadingChar, isError: isErrorChar } = api.interactiveSheet.getCharacter.useQuery({ charId: Number(charId) },{enabled: !!charId,});
    const {data:items, isLoading: isLoadingItems, isError: isErrorItems} = api.interactiveSheet.getAllItems.useQuery({charId: Number(charId)});
    const {data: availableSpells} =  api.interactiveSheet.getAvailableSpells.useQuery({charId: Number(charId)});
    const { mutateAsync: addItem } = api.interactiveSheet.addItem.useMutation();
    const { mutateAsync: learnSpell } = api.interactiveSheet.learnSpell.useMutation();
    const { mutateAsync: prepareSpell } = api.interactiveSheet.prepareSpell.useMutation();
    const { mutateAsync: unprepareSpell } = api.interactiveSheet.unprepareSpell.useMutation();
    const [showItems, setShowItems] = useState(false);
    const handleItemButtonClick = () =>{setShowItems(!showItems);};
    const [showInventory, setShowInventory] = useState(false);
    const [showSpells, setShowSpells] = useState(false);
    const handleInventoryButtonClick = () =>{setShowInventory(!showInventory);};    
    const handleAddItemButtonClick = (itemId: number) => {
      const data = {charId: character?.id??0, itemId: itemId??0};
      if(data.charId==0 || data.itemId==0)
      {
        return <p>Error when trying to add an item to the character. Either character or item id is null or undefined</p>;
      }
      addItem(data);
    };
    const currentPrepared = character?.spellsPrepared.filter((spell) => spell.level > 0).length ?? 0;
    const canPrepareMore = currentPrepared < (character?.spellsPreparedNum ?? 1);
    const knownCantrips = character?.spellsKnown.filter((spell) => spell.level === 0);
    const canLearnMoreCantrips = (knownCantrips?.length??0) < (character?.knownCantripsNum??1);
    const handleSpellsButtonClick =  () => {setShowSpells(!showSpells)};
    const handleLearnSpellClick = async (spellId: number) => {
      if (!character?.id) return;
      try {
        await learnSpell({ charId: character.id, spellId });
        router.reload(); 
      } catch (error) {
        console.error("Failed to learn spell", error);
      }
    };
    const handlePrepareSpellClick = async (spellId: number) => {
    if (!character?.id) return;
    try {
      await prepareSpell({ charId: character.id, spellId });
      router.reload(); // Reload to update spellPrepared list
    } catch (error) {
      console.error("Failed to prepare spell:", error);
    }
    };

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
    <button onClick={handleSpellsButtonClick}>
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
        <div>
          <p>Known cantrips: {knownCantrips?.length} / {character.knownCantripsNum}</p>
          <ul className="space-y-6">
            {availableSpells?.length === 0 && <p>No available spells.</p>}
            {availableSpells?.map((spell: Spell) => {
              const alreadyKnown = character.spellsKnown.some((s) => s.id === spell.id);
              const isCantrip = spell.level === 0;
              const canLearnThis = !alreadyKnown && (!isCantrip || canLearnMoreCantrips);

              return (
                <li key={spell.id}>
                  <p className="font-bold">{spell.name}</p>
                  <p>{spell.description}</p>
                  <p>Level: {spell.level}</p>
                  <p>School: {spell.magicSchool}</p>
                  <p>Range: {spell.range}</p>
                  <p>Casting Time: {spell.castingTime}</p>
                  <p>Components: {spell.components}</p>
                  <button
                    onClick={() => handleLearnSpellClick(spell.id)}
                    disabled={!canLearnThis}
                    className={!canLearnThis ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {alreadyKnown ? "Already known" : "Learn"}
                  </button>
                </li>
              );
            })}
          </ul>
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
      <h2 className="mt-6 font-bold text-lg">Prepared Spells</h2>
      <p>Prepared (excluding cantrips): {currentPrepared} / {character.spellsPreparedNum}</p>
      <ul className="space-y-6">
        {character.spellsPrepared.length === 0 && <p>No prepared spells.</p>}
        {character.spellsPrepared.map((spell: Spell) => (
          <li key={spell.id}>
            <p className="font-bold">{spell.name}</p>
            <p>Level: {spell.level}</p>
            <p>{spell.description}</p>
            <button
              onClick={() => {
                if (!character.id) return;
                unprepareSpell({ charId: character.id, spellId: spell.id }).then(() => router.reload());
              }}
            >
              Unprepare
            </button>
          </li>
        ))}
      </ul>
    </>

}