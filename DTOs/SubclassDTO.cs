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
    [Table("Subclasses")]
    public class SubclassDTO
    {
        [Key]
        public int SubclassId { get; set; }

        public string Name { get; set; }

        public string ShortDescription { get; set; }

        public string Description { get; set; }

        public Abilities SpellcastingAbility { get; set; }

        public bool CanCastSpells { get; set; }

        [Column("SpellList")]
        public string SpellListSerialized { get; set; }

        public bool SpellPrepareType { get; set; }

        [Column("AdditionalSpells")]
        public string AdditionalSpellsSerialized { get; set; }

        // Navigation property for feats
        public List<FeatDTO> SubclassFeats { get; set; } = new List<FeatDTO>();

        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }

        public SubclassDTO() { }

        public SubclassDTO(Subclass subclass)
        {
            SubclassId = new Random().Next();
            Name = subclass.Name;
            ShortDescription = subclass.ShortDescription;
            Description = subclass.Description;
            SpellcastingAbility = (Abilities)subclass.SpellcastingAbility;
            CanCastSpells = subclass.CanCastSpells;
            SpellListSerialized = SerializeSpells(subclass.SpellList);
            SpellPrepareType = subclass.SpellPrepareType;
            AdditionalSpellsSerialized = SerializeSpells(subclass.AdditionalSpells);
            SubclassFeats = subclass.SubclassFeats?.ConvertAll(feat => new FeatDTO(feat)) ?? new List<FeatDTO>();
        }

        private string SerializeSpells(List<Spell> spells)
        {
            // Serialize spells into a comma-separated format for storage
            return string.Join(",", spells?.Select(spell => spell.ToString())); // Assumes Spell has a ToString() method
        }
    }
}
