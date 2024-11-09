using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{

    public class Item
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; } 
        public bool IsMagical { get; }
        public string Type { get; }

        public Item() { }
        public Item(string name, string description, int weight, int value, bool isMagical, string type)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;
            Type = type;
        }
        public Item(string name, string description)
        {
            Name = name;
            Description = description;
        }
    }

    public class Weapon : Item
    {
        public string DamageType { get; } // e.g., Slashing, Piercing, Bludgeoning
        public int DamageDiceNumber { get; }
        public int DamageDiceFaces { get; }
        public bool IsRanged { get; }
        public int Range { get; } // Only for ranged weapons
        public string WeaponType { get; }

        public Weapon(string name, string description, int weight, int value, bool isMagical,
            string type, string damageType, int damageDiceNumber, int damageDiceFaces,
            bool isRanged, int range = 0, string weaponType = null)
            : base(name, description, weight, value, isMagical, type)
        {
            DamageType = damageType;
            DamageDiceNumber = damageDiceNumber;
            DamageDiceFaces = damageDiceFaces;
            IsRanged = isRanged;
            Range = range;
            WeaponType = weaponType;
        }
    }
    public class Armor : Item
    {
        public int ArmorClass { get; }
        public string ArmorType { get; } // Light, Medium, Heavy
        public bool RequiresProficiency { get; }

        public Armor(string name, string description, int weight, int value, bool isMagical, string type, int armorClass, string armorType, bool requiresProficiency)
            : base(name, description, weight, value, isMagical, type)
        {
            ArmorClass = armorClass;
            ArmorType = armorType;
            RequiresProficiency = requiresProficiency;
        }
    }

    public class Potion : Item
    {
        public string Effect { get; }
        public int Duration { get; } // Duration in minutes (if applicable)

        public Potion(string name, string description, int weight, int value, bool isMagical, string type, string effect, int duration = 0)
            : base(name, description, weight, value, isMagical, type)
        {
            Effect = effect;
            Duration = duration;
        }
    }
    public class Scroll : Item
    {
        public Spell Spell { get; }
        public int SpellLevel { get; }

        public Scroll(string name, string description, int weight, int value, bool isMagical, string type, Spell spell, int spellLevel) : base(name, description, weight, value, isMagical, type)
        {
            Spell = spell;
            SpellLevel = spellLevel;
        }
    }

    public class Gear : Item
    {
        public string Usage { get; } // General use or purpose of the gear

        public Gear(string name, string description, int weight, int value, bool isMagical, string type, string usage)
            : base(name, description, weight, value, isMagical, type)
        {
            Usage = usage;
        }
        public Gear(string name, string description, string usage): base(name, description)
        {
            Usage = usage;
        }
        public Gear(string name, string description) : base(name, description) { }
    }
}
    