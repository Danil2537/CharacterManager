using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Items")]
    public class ItemDTO
    {
        [Key]
        public int ItemId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }
        public string Type { get; } //maybe create a separate table for this;
        public bool IsFromBackground { get; set; }
        [ForeignKey("Background")]
        public int BelongToBackground { get; set; }
        public virtual BackgroundDTO Background { get; set; }

        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }

        public ItemDTO() { }
        public ItemDTO(Item item)
        {
            Name = item.Name;
            Description = item.Description;
            Weight = item.Weight;
            Value = item.Value;
            IsMagical = item.IsMagical;
            Type = item.Type;
        }
    }

        [Table("Weapons")]
        public class WeaponDTO 
        {
        public int WeaponId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }


        public string DamageType { get; } // e.g. Slashing, Piercing, Bludgeoning
        public int DamageDiceNumber { get; }
        public int DamageDiceFaces { get; }
        public bool IsRanged { get; }
        public int Range { get; } // Only for ranged weapons
        public string WeaponType { get; }

        public WeaponDTO(string name, string description, int weight, int value, bool isMagical,
            string damageType, int damageDiceNumber, int damageDiceFaces,
            bool isRanged, int range = 0, string weaponType = null)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;

            DamageType = damageType;
            DamageDiceNumber = damageDiceNumber;
            DamageDiceFaces = damageDiceFaces;
            IsRanged = isRanged;
            Range = range;
            WeaponType = weaponType;
        }
        }
    [Table("Armor")]
    public class ArmorDTO
    {
        public int ArmorId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }


        public int ArmorClass { get; }
        public string ArmorType { get; } // Light, Medium, Heavy
        public bool RequiresProficiency { get; }

        public ArmorDTO(string name, string description, int weight, int value, bool isMagical, string type, int armorClass, string armorType, bool requiresProficiency)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;

            ArmorClass = armorClass;
            ArmorType = armorType;
            RequiresProficiency = requiresProficiency;
        }
    }
    [Table("Potions")]
    public class PotionDTO
    {
        public int PotionId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }


        public string Effect { get; }
        public int Duration { get; } // Duration in minutes (if applicable)

        public PotionDTO(string name, string description, int weight, int value, bool isMagical, string type, string effect, int duration = 0)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;

            Effect = effect;
            Duration = duration;
        }
    }
    [Table("Scrolls")]
    public class ScrollDTO
    {
        public int ScrollId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }


        [ForeignKey("Spell")]
        public int SpellId { get; set; }
        public SpellDTO Spell { get; set; }
        public int SpellLevel { get; }

        public ScrollDTO(string name, string description, int weight, int value, bool isMagical, string type, int spellId, int spellLevel)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;
            SpellId = spellId;
            SpellLevel = spellLevel;
        }
    }
    [Table("Gear")]
    public class GearDTO
    {
        public int GearId { get; set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int Weight { get; }
        public int Value { get; }
        public bool IsMagical { get; }


        public string Usage { get; } // General use or purpose of the gear

        public GearDTO(string name, string description, int weight, int value, bool isMagical, string type, string usage)
        {
            Name = name;
            Description = description;
            Weight = weight;
            Value = value;
            IsMagical = isMagical;

            Usage = usage;
        }
        public GearDTO(string usage) 
        {
            Usage = usage;
        }
    }

}
