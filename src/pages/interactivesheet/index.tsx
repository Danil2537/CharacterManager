import { useRouter } from "next/router";
import { api } from "../../utils/api";
import type { CharacterItems, Item } from "@prisma/client";
import {useState} from "react";
export default function InteractiveSheet()
{
    const router = useRouter();
    const { charId } = router.query;
    console.log(`char id ${charId}`);
    const { data: character, isLoading: isLoadingChar, isError: isErrorChar } = api.interactiveSheet.getCharacter.useQuery(
    { charId: Number(charId) },
    {
      enabled: !!charId,
    });
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
      addItem(data);
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
    </>

}