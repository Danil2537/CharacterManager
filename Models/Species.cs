using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{ 
   public class Species
   {
    public string Name { get; }
    public string Description { get; }
    public string Source { get; }
    public Sizes Size { get; }
    public int Speed { get; }
    public int FlyingSpeed { get; }
    public int SwimmingSpeed { get; }
    public int Darkvision { get; }
    public int LanguagesChoices { get; }
    public List<string> Languages { get; }
    public int SkillProficiencies { get; }
    public HashSet<Abilities> AbilityBonuses { get; }
    public List<Skills> SkillProfOptions { get; }
    public HashSet<Skills> ProficientSkills { get; }
    public HashSet<Abilities> ProficientSavingThrows { get; }
    public HashSet<string> Resistances { get; }
    public HashSet<string> Immunities { get; }
    public List<Feat> SpeciesFeats { get; }

    public Species(string name, string description, string source, Sizes size, int speed, int flyingSpeed,
                    int swimmingSpeed, int darkvision, int languagesChoices, List<string> languages)
    {
            Name = name;
            Description = description;
            Source = source;
            Size = size;
            Speed = speed;
            FlyingSpeed = flyingSpeed;
            SwimmingSpeed = swimmingSpeed;
            Darkvision = darkvision;
            LanguagesChoices = languagesChoices;
            Languages = languages;
            AbilityBonuses = new HashSet<Abilities>();
            ProficientSkills = new HashSet<Skills>();
            ProficientSavingThrows = new HashSet<Abilities>();
            Resistances = new HashSet<string>();
            Immunities = new HashSet<string>();
    }

        // Simplified constructor
    public Species(string name)
    {
        Name = name;
    }
    public void AddAbilityBonus(Abilities ability)
    {
        AbilityBonuses.Add(ability);
    }

    public void AddSkillProficiency(Skills skill)
    {
        ProficientSkills.Add(skill);
    }

    public void AddSavingThrowProficiency(Abilities ability)
    {
        ProficientSavingThrows.Add(ability);
    }

    public void AddResistance(string resistance)
    {
        Resistances.Add(resistance);
    }

    public void AddImmunity(string immunity)
    {
        Immunities.Add(immunity);
    }

    public void DisplaySpeciesInfo()
    {
        Console.WriteLine($"Species: {Name}");
        Console.WriteLine($"Description: {Description}");
        Console.WriteLine($"Speed: {Speed}, Flying Speed: {FlyingSpeed}, Swimming Speed: {SwimmingSpeed}");
        Console.WriteLine($"Darkvision: {Darkvision} feet");
        Console.WriteLine($"Languages: {string.Join(", ", Languages)}");
    }
}

}
