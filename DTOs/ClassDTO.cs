using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Classes")]
    public class ClassDTO
    {
        [Key]
        public int ClassId { get; set; }

        public string Name { get; set; }

        public string Source { get; set; }

        public string Description { get; set; }

        public Abilities MainAbility { get; set; }

        public int HitDieType { get; set; }

        public int HitDieNumber { get; set; }

        public int SubclassLevel { get; set; }

        public string SubclassDescription { get; set; }

        [Column("AbilityIncreaseLevels")]
        public string AbilityIncreaseLevelsSerialized { get; set; }

        public bool HaveSpells { get; set; }

        public int SkillProficienciesNumber { get; set; }

        public int SkillExpertisesNumber { get; set; }

        [Column("ProficientSavingThrows")]
        public string ProficientSavingThrowsSerialized { get; set; }

        [Column("SkillProfOptions")]
        public string SkillProfOptionsSerialized { get; set; }

        [Column("ProficientSkills")]
        public string ProficientSkillsSerialized { get; set; }

        [Column("ExpertiseSkills")]
        public string ExpertiseSkillsSerialized { get; set; }

        // Navigation properties
        public List<SubclassDTO> AvailableSubclasses { get; set; } = new List<SubclassDTO>();
        public List<FeatDTO> ClassFeats { get; set; } = new List<FeatDTO>();

        [Column("StartingGoldDice")]
        public string StartingGoldDiceSerialized { get; set; }

        public int StartingGold { get; set; }

        [Column("StartingItemsOptions")]
        public string StartingItemsOptionsSerialized { get; set; }

        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }

        public ClassDTO() { }

        public ClassDTO(Class classObj)
        {
            ClassId = new Random().Next();
            Name = classObj.Name;
            //Source = classObj.Source;
            Description = classObj.Description;
            MainAbility = (Abilities)classObj.MainAbility;
            HitDieType = classObj.HitDieType;
            HitDieNumber = classObj.HitDieNumber;
            //SubclassLevel = classObj.SubclassLevel;
            //SubclassDescription = classObj.SubclassDescription;
           // AbilityIncreaseLevelsSerialized = string.Join(",", classObj.AbilityIncreaseLevels);
            //HaveSpells = classObj.HaveSpells;
            //SkillProficienciesNumber = classObj.SkillProficienciesNumber;
            //SkillExpertisesNumber = classObj.SkillExpertisesNumber;
            ProficientSavingThrowsSerialized = string.Join(",", classObj.ProficientSavingThrows);
            //SkillProfOptionsSerialized = string.Join(",", classObj.SkillProfOptions);
            //ProficientSkillsSerialized = string.Join(",", classObj.ProficientSkills);
            //ExpertiseSkillsSerialized = string.Join(",", classObj.ExpertiseSkills);
            StartingGoldDiceSerialized = classObj.StartingGoldDice.ToString(); // Assumes Dice has a ToString() method
            StartingGold = classObj.StartingGold;
            StartingItemsOptionsSerialized = SerializeStartingItemsOptions(classObj.StartingItemsOptions);

            //AvailableSubclasses = classObj.AvailableSubclasses?.ConvertAll(sc => new SubclassDTO(sc)) ?? new List<SubclassDTO>();
            ClassFeats = classObj.ClassFeats?.ConvertAll(feat => new FeatDTO(feat)) ?? new List<FeatDTO>();
        }

        private string SerializeStartingItemsOptions(ObservableCollection<List<Item>> startingItemsOptions)
        {
            // Serialize the list of items into a suitable format
            return string.Join(";", startingItemsOptions?.Select(
                list => string.Join(",", list.Select(item => item.ToString())))); // Assumes Item has a ToString() method
        }
    }
}
