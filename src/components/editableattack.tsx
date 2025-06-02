import { Ability, type Attack } from "@prisma/client";
import { useState } from "react";
import { triggerCustomDiceRoll, triggerAbilityCheck } from "./diceroller";

type DamageDice = {
  num: number;
  faces: number;
};

type EditableAttackProps = {
  attack: Attack;
  onSave: (updated: Attack) => void;
};

export const EditableAttack = ({ attack, onSave }: EditableAttackProps) => {
  const [editable, setEditable] = useState(attack);

  const handleChange = (key: keyof Attack, value: any) => {
    setEditable((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiceChange = (key: keyof DamageDice, value: number) => {
    const dice = editable.damageDice as DamageDice;
    const updatedDice = { ...dice, [key]: value };
    handleChange("damageDice", updatedDice);
  };

  return (
    <div className="w-[260px] space-y-2 flex flex-wrap">
      <input
        className="flex flex-col w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={editable.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
      />

      <input
        className="w-[200px] px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        value={editable.toHitBonus}
        onChange={(e) => handleChange("toHitBonus", Number(e.target.value))}
        placeholder="To Hit Bonus"
      />
      <button className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => 
            triggerAbilityCheck(editable.toHitBonus)
          }>
      🎲
      </button>

      <textarea
        className="w-full px-3 py-1.5 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editable.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Notes"
      />

<div className="flex items-center gap-2">
  <input
    type="number"
    className="input w-16 px-2 py-1 border rounded-md"
    value={(editable.damageDice as DamageDice).num}
    onChange={(e) => handleDiceChange("num", Number(e.target.value))}
  />
  <span className="text-gray-600">d</span>
  <input
    type="number"
    className="input w-16 px-2 py-1 border rounded-md"
    value={(editable.damageDice as DamageDice).faces}
    onChange={(e) => handleDiceChange("faces", Number(e.target.value))}
  />
  <button
    className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
    onClick={() =>
      triggerCustomDiceRoll(
        (editable.damageDice as DamageDice).num,
        (editable.damageDice as DamageDice).faces
      )
    }
  >
    🎲
  </button>
</div>

      <input
        type="text"
        className="input"
        value={editable.damageTypes}
        onChange={(e) => handleChange("damageTypes", e.target.value)}
        placeholder="Damage Types"
      />

      <select
        className="select w-full bg-[#171a4d]"
        value={editable.ability}
        onChange={(e) => handleChange("ability", e.target.value as Ability)}
      >
        {Object.values(Ability).map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={editable.addProfBonus}
          onChange={(e) => handleChange("addProfBonus", e.target.checked)}
        />
        Add Proficiency Bonus
      </label>

      <input
        type="number"
        className="input w-full"
        value={editable.additionalModifier ?? ""}
        onChange={(e) =>
          handleChange("additionalModifier", e.target.value === "" ? null : Number(e.target.value))
        }
        placeholder="Additional Modifier"
      />

      <button
        className="btn w-[100px] py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={() => onSave(editable)}
      >
        Save
      </button>
    </div>
  );
};