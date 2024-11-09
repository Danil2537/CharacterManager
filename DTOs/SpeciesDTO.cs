using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Species")]
    public class SpeciesDTO
    {
        [Key]
        public int SpeciesId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Source { get; set; }

        public Sizes Size { get; set; }

        public int Speed { get; set; }

        public int FlyingSpeed { get; set; }

        public int SwimmingSpeed { get; set; }

        public int Darkvision { get; set; }

        public int LanguagesChoices { get; set; }

        [Column("Languages")]
        public string LanguagesSerialized { get; set; }

        public int SkillProficiencies { get; set; }

        [Column("AbilityBonuses")]
        public string AbilityBonusesSerialized { get; set; }

        [Column("SkillProfOptions")]
        public string SkillProfOptionsSerialized { get; set; }

        [Column("ProficientSkills")]
        public string ProficientSkillsSerialized { get; set; }

        [Column("ProficientSavingThrows")]
        public string ProficientSavingThrowsSerialized { get; set; }

        [Column("Resistances")]
        public string ResistancesSerialized { get; set; }

        [Column("Immunities")]
        public string ImmunitiesSerialized { get; set; }

        // Navigation property for related feats
        public List<FeatDTO> SpeciesFeats { get; set; } = new List<FeatDTO>();

        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }

        public SpeciesDTO()
        {
        }

        public SpeciesDTO(Species species)
        {
            SpeciesId = new Random().Next(); 
            Name = species.Name;
            Description = species.Description;
            //Source = species.Source;
            Size = (Sizes)species.Size;
            Speed = species.Speed;
            //FlyingSpeed = species.FlyingSpeed;
            //SwimmingSpeed = species.SwimmingSpeed;
           // Darkvision = species.Darkvision;
            //LanguagesChoices = species.LanguagesChoices;
            SkillProficiencies = species.SkillProficiencies;

            // Serialize collections for storage
            LanguagesSerialized = string.Join(",", species.Languages);
            //AbilityBonusesSerialized = string.Join(",", species.AbilityBonuses);
            //SkillProfOptionsSerialized = string.Join(",", species.SkillProfOptions);
            //ProficientSkillsSerialized = string.Join(",", species.ProficientSkills);
           // ProficientSavingThrowsSerialized = string.Join(",", species.ProficientSavingThrows);
            //ResistancesSerialized = string.Join(",", species.Resistances);
           // ImmunitiesSerialized = string.Join(",", species.Immunities);

            // Map feats if needed
            SpeciesFeats = species.SpeciesFeats?.ConvertAll(f => new FeatDTO(f)) ?? new List<FeatDTO>();
        }
    }
}
