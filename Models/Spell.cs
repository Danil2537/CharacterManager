using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{

    public class Spell
    {
        public string Name { get; }
        public int BaseLevel { get; }
        public string CastingTime { get; }
        public int Range { get; }
        public bool IsVerbal { get; }
        public bool IsSomatic { get; }
        public bool IsMaterial { get; }
        public string RequiredMaterials { get; }
        public int MaterialCost { get; }
        public string Duration { get; }
        public string Source { get; }
        public string Description { get; }
        public bool IsSave { get; }
        public bool IsAttack { get; }
        public bool IsConcentration { get; }
        public bool IsRitual { get; }
        public string AtHigherLevels { get; }
        public int DmgDiceNum { get; }
        public int DmgDiceFaces { get; }
        public int DmgBonus { get; }
        public string DmgType { get; }

        public Spell(int baseLevel, string castingTime, int range, bool isVerbal, bool isSomatic, bool isMaterial, string requiredMaterials,
                     int materialCost, string duration, string source, string description, bool isSave, bool isAttack, string atHigherLevels,
                     int dmgDiceNum, int dmgDiceFaces, int dmgBonus)
        {
            BaseLevel = baseLevel;
            CastingTime = castingTime;
            Range = range;
            IsVerbal = isVerbal;
            IsSomatic = isSomatic;
            IsMaterial = isMaterial;
            RequiredMaterials = requiredMaterials;
            MaterialCost = materialCost;
            Duration = duration;
            Source = source;
            Description = description;
            IsSave = isSave;
            IsAttack = isAttack;
            AtHigherLevels = atHigherLevels;
            DmgDiceNum = dmgDiceNum;
            DmgDiceFaces = dmgDiceFaces;
            DmgBonus = dmgBonus;
        }

        public int CastAttack(int bonus)
        {
            if (!IsAttack)
            {
                Console.WriteLine("This spell is not an Attack Spell. Can't roll ToHit dice with it.");
                return 0;
            }

            Dice dice = new Dice(1, 20, 0);
            int toHit = dice.Roll();
            Console.WriteLine($"To hit dice returned {toHit} + {bonus}");
            return toHit + bonus;
        }

        public int CalculateDamage()
        {
            Dice dmgDice = new Dice(DmgDiceNum, DmgDiceFaces, 0);
            int damage = dmgDice.Roll() + DmgBonus;
            Console.WriteLine($"Damage dice returned {damage} (including {DmgBonus} bonus)");
            return damage;
        }

        public void DisplaySpellDetails()
        {
            Console.WriteLine($"Spell: {Description}");
            Console.WriteLine($"Level: {BaseLevel}, Casting Time: {CastingTime}, Range: {Range}");
            Console.WriteLine($"Verbal: {IsVerbal}, Somatic: {IsSomatic}, Material: {IsMaterial} (Materials: {RequiredMaterials})");
            Console.WriteLine($"Duration: {Duration}, Source: {Source}");
            Console.WriteLine($"Damage: {DmgDiceNum}d{DmgDiceFaces} + {DmgBonus}");
            if (IsSave)
            {
                Console.WriteLine("This spell requires a saving throw.");
            }
            if (IsAttack)
            {
                Console.WriteLine("This spell requires an attack roll.");
            }
        }
    }
}
