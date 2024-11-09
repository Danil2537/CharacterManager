using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Security.Policy;
using System.Security.RightsManagement;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Effects;



namespace CharacterManager
{
    public enum Abilities : int { Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma }
    public enum Skills : int
    {
        Acrobatics, AnimalHandling, Arcana, Athletics, Deception, History, Insight, Intimidation,
        Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, SleightOfHand, Stealth, Survival
    }
    public enum Sizes { tiny, small, medium, large, giant};

    public enum Tools : int
    {
    Artisan_tools,
    Alchemist_supplies,
    Brewer_supplies,
    Calligrapher_supplies,
    Carpenter_tools,
    Cartographer_tools,
    Cobbler_tools,
    Cook_utensils,
    Glassblower_tools,
    Jeweler_tools,
    Leatherworker_tools,
    Mason_tools,
    Painter_supplies,
    Potter_tools,
    Smith_tools,
    Tinker_tools,
    Weaver_tools,
    Woodcarver_tools,
    Gaming_set,
    Dice_set,
    Dragonchess_set,
    Playing_card_set,
    ThreeDragon_Ante_set,
    Bagpipes,
    Drum,
    Dulcimer,
    Flute,
    Lute,
    Lyre,
    Horn,
    Pan_flute,
    Shawm,
    Viol,
    Disguise_kit,
    Forgery_kit,
    Herbalism_kit,
    Navigator_tools,
    Poisoner_kit,
    Thieve_tools
    }

    public enum Languages : int
    {
        Common,
        Dwarvish,
        Elvish,
        Giant,
        Gnomish,
        Goblin,
        Halfling,
        Orc,
        Abyssal,
        Celestial,
        Draconic,
        Deep_Speech,
        Infernal,
        Primordial,
        Sylvan,
        Undercommon
    }


    public class Character
    {
        public Dictionary<Abilities, int> CharacterAbilities { get; }
        public Dictionary<Skills, int> CharacterSkills { get; }
        public HashSet<Skills> ProficientSkills { get; }
        public HashSet<Abilities> ProficientSavingThrows { get; }
        public List<Item> Inventory { get; }
        public List<Spell> Spellbook { get; }
        public List<Spell> PreparedSpells { get; }
        public List<string> ItemProficiencies { get; } //TODO: weapon, armor and tool proficiencies;
        public Class CharClass { get; }
        public Subclass CharSubClass { get; }
        public Species CharSpecies { get; }
        public string Name { get; set; }
        public Background Background { get;  set; }
        public int Age { get; }
        public string Gender { get; }
        public int Height { get; }
        public int Weight { get; }
        public int Level { get; set; }
        public int ProficiencyBonus => (7 + Level) / 4; // Formula for proficiency bonus
        public int Speed { get; set; }
        public int CurrentHealth { get; set; }
        public int MaxHealth { get; set; }
        public int TempHealth { get; set; }
        public int ArmorClass { get; set; }
        public int InitiativeBonus { get; set; }
        public int SpellAttack { get; set; } //base magic modifier + prof_bonus;
        public int RangeAttack { get; set; } 
        public int SaveDC { get; set; }
        public List<float> Money;


        // Constructor
        public Character(string name, Class charClass, Species charSpecies, int level)
        {
            Name = name;
            CharClass = charClass;
            CharSpecies = charSpecies;
            Level = level;

            CharacterAbilities = Enum.GetValues(typeof(Abilities)).Cast<Abilities>()
                .ToDictionary(ability => ability, ability => 0);

            CharacterSkills = Enum.GetValues(typeof(Skills)).Cast<Skills>()
                .ToDictionary(skill => skill, skill => 0);

            ProficientSkills = new HashSet<Skills>();
            ProficientSavingThrows = new HashSet<Abilities>();
            Inventory = new List<Item>();
            Spellbook = new List<Spell>();
            ItemProficiencies = new List<string>();

            SetSkills();
        }
        public int GetModifier(int abilityValue)
        {
            return (abilityValue - 10) / 2;
        }
        public void SetSkills()
        {
            var abilityToSkillsMap = new Dictionary<Abilities, List<Skills>>()
        {
            { Abilities.Strength, new List<Skills> { Skills.Athletics } },
            { Abilities.Dexterity, new List<Skills> { Skills.Acrobatics, Skills.SleightOfHand, Skills.Stealth } },
            { Abilities.Intelligence, new List<Skills> { Skills.Arcana, Skills.History, Skills.Investigation, Skills.Nature, Skills.Religion } },
            { Abilities.Wisdom, new List<Skills> { Skills.AnimalHandling, Skills.Insight, Skills.Medicine, Skills.Perception, Skills.Survival } },
            { Abilities.Charisma, new List<Skills> { Skills.Deception, Skills.Intimidation, Skills.Performance, Skills.Persuasion } }
        };

            foreach (var entry in abilityToSkillsMap)
            {
                int modifier = GetModifier(CharacterAbilities[entry.Key]);
                foreach (var skill in entry.Value)
                {
                    CharacterSkills[skill] = modifier;
                    if (ProficientSkills.Contains(skill))
                    {
                        CharacterSkills[skill] += ProficiencyBonus;
                    }
                }
            }
        }
        public int GetSkill(Skills skillId)
        {
            return CharacterSkills[skillId];
        }
        public int GetAbility(Abilities abilityId)
        {
            return CharacterAbilities[abilityId];
        }
        public void AddSkillProficiency(Skills skillId)
        {
            ProficientSkills.Add(skillId);
        }

        public void SetAbilities(int str, int dex, int con, int intelligence, int wis, int cha)
        {
            CharacterAbilities[Abilities.Strength] = str;
            CharacterAbilities[Abilities.Dexterity] = dex;
            CharacterAbilities[Abilities.Constitution] = con;
            CharacterAbilities[Abilities.Intelligence] = intelligence;
            CharacterAbilities[Abilities.Wisdom] = wis;
            CharacterAbilities[Abilities.Charisma] = cha;
        }
        public void AddSavingThrowProficiency(Abilities abilityId)
        {
            ProficientSavingThrows.Add(abilityId);
        }
        public int GetSavingThrowBonus(Abilities abilityId)
        {
            int bonus = GetModifier(GetAbility(abilityId));
            if (ProficientSavingThrows.Contains(abilityId))
            {
                bonus += ProficiencyBonus;
            }
            return bonus;
        }
    }
}
