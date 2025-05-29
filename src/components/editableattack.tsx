import { Ability, type Attack } from "@prisma/client";
import { useState } from "react";

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
    <div className="border p-4 rounded-md space-y-2">
      <input
        className="input w-full"
        type="text"
        value={editable.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
      />

      <input
        className="input w-full"
        type="number"
        value={editable.toHitBonus}
        onChange={(e) => handleChange("toHitBonus", Number(e.target.value))}
        placeholder="To Hit Bonus"
      />

      <textarea
        className="textarea w-full"
        value={editable.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Notes"
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="input"
          value={(editable.damageDice as DamageDice).num}
          onChange={(e) => handleDiceChange("num", Number(e.target.value))}
        />
        <span>d</span>
        <input
          type="number"
          className="input"
          value={(editable.damageDice as DamageDice).faces}
          onChange={(e) => handleDiceChange("faces", Number(e.target.value))}
        />
      </div>

      <input
        type="text"
        className="input w-full"
        value={editable.damageTypes}
        onChange={(e) => handleChange("damageTypes", e.target.value)}
        placeholder="Damage Types"
      />

      <select
        className="select w-full"
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
        className="btn mt-2"
        onClick={() => onSave(editable)}
      >
        Save
      </button>
    </div>
  );
};