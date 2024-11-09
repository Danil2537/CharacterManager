using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Characters")]
    public class CharacterDTO
    {
        [Key]
        public int CharacterId { get; set; }

        public string Name { get; set; }

        public string Gender { get; set; }

        public int Age { get; set; }

        public int Height { get; set; }

        public int Weight { get; set; }

        public int Level { get; set; }

        public int Speed { get; set; }

        public int CurrentHealth { get; set; }

        public int MaxHealth { get; set; }

        public int TempHealth { get; set; }

        public int ArmorClass { get; set; }

        public int InitiativeBonus { get; set; }

        public int SpellAttack { get; set; }

        public int RangeAttack { get; set; }

        public int SaveDC { get; set; }

        [Column("CharacterAbilities")]
        public string CharacterAbilitiesSerialized { get; set; }

        [Column("CharacterSkills")]
        public string CharacterSkillsSerialized { get; set; }

        [Column("ProficientSkills")]
        public string ProficientSkillsSerialized { get; set; }

        [Column("ProficientSavingThrows")]
        public string ProficientSavingThrowsSerialized { get; set; }

        [Column("Inventory")]
        public string InventorySerialized { get; set; }

        [Column("Spellbook")]
        public string SpellbookSerialized { get; set; }

        [Column("PreparedSpells")]
        public string PreparedSpellsSerialized { get; set; }

        [Column("ItemProficiencies")]
        public string ItemProficienciesSerialized { get; set; }

        [Column("Money")]
        public string MoneySerialized { get; set; }

        // Navigation Properties
        public ClassDTO CharClass { get; set; }
        public SubclassDTO CharSubClass { get; set; }
        public SpeciesDTO CharSpecies { get; set; }
        public BackgroundDTO Background { get; set; }
        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }
        public CharacterDTO() { }

        public CharacterDTO(Character character)
        {
            CharacterId = new Random().Next();
            Name = character.Name;

            Level = character.Level;
            Speed = character.Speed;
            CurrentHealth = character.CurrentHealth;
            MaxHealth = character.MaxHealth;
            ArmorClass = character.ArmorClass;
            InitiativeBonus = character.InitiativeBonus;


            CharacterAbilitiesSerialized = SerializeDictionary(character.CharacterAbilities);
            CharacterSkillsSerialized = SerializeDictionary(character.CharacterSkills);
            ProficientSkillsSerialized = SerializeHashSet(character.ProficientSkills);
            ProficientSavingThrowsSerialized = SerializeHashSet(character.ProficientSavingThrows);
            InventorySerialized = SerializeList(character.Inventory);

            //CharClass = new ClassDTO(character.CharClass);
            //CharSpecies = new SpeciesDTO(character.CharSpecies);
            //Background = character.Background != null ? new BackgroundDTO(character.Background) : null;
        }

        private string SerializeDictionary<TKey, TValue>(Dictionary<TKey, TValue> dictionary)
        {
            return string.Join(";", dictionary.Select(kv => $"{kv.Key}:{kv.Value}"));
        }

        private string SerializeHashSet<T>(HashSet<T> hashSet)
        {
            return string.Join(",", hashSet);
        }

        private string SerializeList<T>(List<T> list)
        {
            return string.Join(",", list.Select(item => item.ToString())); // Assumes item has a ToString() method
        }
    }
}
