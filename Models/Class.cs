using CharacterManager.DTOs;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{
    public class Class
    {
        public string Name { get; }
        public string Source { get; }
        public string Description { get; }
        public Abilities MainAbility { get; }
        public int HitDieType { get; }
        public int HitDieNumber { get; }
        public int SubclassLevel { get; }
        public string SubclassDescription { get; }
        public List<int> AbilityIncreaseLevels { get; }
        public bool HaveSpells { get; }
        public int SkillProficienciesNumber { get; }
        public int SkillExpertisesNumber { get; }
        public HashSet<Abilities> ProficientSavingThrows { get; }
        public List<Skills> SkillProfOptions { get; }
        public HashSet<Skills> ProficientSkills { get; }
        public HashSet<Skills> ExpertiseSkills { get; }
        public List<Subclass> AvailableSubclasses { get; }
        public List<Feat> ClassFeats { get; }
        public Dice StartingGoldDice { get; }
        public int StartingGold { get; }
        public ObservableCollection<List<Item>> StartingItemsOptions { get; }

        public Class(string name, string source, string description,
                    Abilities mainAbility, int hitDieType, int hitDieNumber, int subclassLevel,
                    string subclassDescription, List<int> abilityIncreaseLevels, bool haveSpells,
                    int skillProficiencyNumber, List<Skills> skillProfOptions, List<Feat> classFeats,
                    Dice startingGoldDice,
                    HashSet<Abilities> proficientSavingThrows,
                    ObservableCollection<List<Item>> startingItemsOptions,
                    List<Subclass> availableSubclasses = null)
        {
            Name = name;
            Source = source;
            Description = description;
            MainAbility = mainAbility;
            HitDieType = hitDieType;
            HitDieNumber = hitDieNumber;
            SubclassLevel = subclassLevel;
            SubclassDescription = subclassDescription;
            AbilityIncreaseLevels = abilityIncreaseLevels;
            HaveSpells = haveSpells;
            SkillProficienciesNumber = skillProficiencyNumber;
            SkillProfOptions = skillProfOptions;
            ClassFeats = classFeats;
            StartingGoldDice = startingGoldDice;
            ProficientSavingThrows = proficientSavingThrows;
            StartingItemsOptions = startingItemsOptions;
            AvailableSubclasses = availableSubclasses ?? new List<Subclass>();
            StartingGold = StartingGoldDice.Roll() * 10;
        }
        public Class(string name) { Name = name; }

        public Class(ClassDTO classDTO)
        {

        }

        public void AddSavingThrowProficiency(Abilities ability)
        {
            ProficientSavingThrows.Add(ability);
        }

        public void AddSkillProficiency(Skills skill)
        {
            ProficientSkills.Add(skill);
        }

        public void AddSkillExpertise(Skills skill)
        {
            ExpertiseSkills.Add(skill);
        }

        public void AddAvailableSubclass(Subclass subclass)
        {
            this.AvailableSubclasses.Add(subclass);
        }
        public void DisplayClassInfo()
        {
            Console.WriteLine($"Class: {Name}");
            Console.WriteLine($"Description: {Description}");
            Console.WriteLine($"Hit Die: {HitDieNumber}d{HitDieType}");
            Console.WriteLine($"Subclass unlocked at level {SubclassLevel}: {SubclassDescription}");
            Console.WriteLine($"Spells: {(HaveSpells ? "Yes" : "No")}");
        }
    }

}
