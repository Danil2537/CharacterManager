using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace CharacterManager.Models
{
    public class Subclass
    { 
        public string Name;
        public string ShortDescription;
        public string Description;
        public Abilities SpellcastingAbility;
        public bool CanCastSpells;
        public List<Spell> SpellList;
        public bool SpellPrepareType; //use full casting table (like wizard) or half the table (arcane trickster);
        public List<Spell> AdditionalSpells; //like cleric domain spells or smth;
        public List<Feat> SubclassFeats;

        
        public Subclass(string name, string shortDescription, string description, Abilities spellcastingAbility,
            bool canCastSpells, List<Spell> spellList, bool spellPrepareType, List<Spell> additionalSpells)
        {
            Name = name;
            ShortDescription = shortDescription;
            Description = description;
            SpellcastingAbility = spellcastingAbility;
            CanCastSpells = canCastSpells;
            SpellList = spellList;
            SpellPrepareType = spellPrepareType;
            AdditionalSpells = additionalSpells;
        }

        // Simplified constructor
        public Subclass(string name)
        {
            Name = name;
        }
    }
}
