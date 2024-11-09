using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media.Media3D;
using System.Windows;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CharacterManager.DTOs
{
    [Table("Spells")]
    public class SpellDTO
    {
        [Key]
        public int SpellId { get; set; }
        public string Name { get; set; }
        public int BaseLevel { get; set; }
        public string CastingTime { get; set; }
        public int Range { get; set; }
        public bool IsVerbal { get; set; }
        public bool IsSomatic { get; set; }
        public bool IsMaterial { get; set; }
        public string RequiredMaterials { get; set; }
        public int MaterialCost { get; set; }
        public string Duration { get; set; }
        public string Source { get; set; }
        public string Description { get; set; }
        public bool IsSave { get; set; }
        public bool IsAttack { get; set; }
        public bool IsConcentration { get; set; }
        public bool IsRitual { get; set; }
        public string AtHigherLevels { get; set; }
        public int DmgDiceNum { get; set; }
        public int DmgDiceFaces { get; set; }
        public int DmgBonus { get; set; }
        public string DmgType { get; set; }

        public SpellDTO(string name, int baseLevel, string castingTime,
            int range, bool isVerbal, bool isSomatic, bool isMaterial, 
            string requiredMaterials, int materialCost, string duration,
            string source, string description, bool isSave, bool isAttack,
            bool isConcentration, bool isRitual, string atHigherLevels,
            int dmgDiceNum, int dmgDiceFaces, int dmgBonus, string dmgType)
        {
            Name = name;
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
            IsConcentration = isConcentration;
            IsRitual = isRitual;
            AtHigherLevels = atHigherLevels;
            DmgDiceNum = dmgDiceNum;
            DmgDiceFaces = dmgDiceFaces;
            DmgBonus = dmgBonus;
            DmgType = dmgType;
        }
        public SpellDTO(Models.Spell spell)
        {
            Name = spell.Name;
            BaseLevel = spell.BaseLevel;
            CastingTime = spell.CastingTime;
            Range = spell.Range;
            IsVerbal = spell.IsVerbal;
            IsSomatic = spell.IsSomatic;
            IsMaterial = spell.IsMaterial;
            RequiredMaterials = spell.RequiredMaterials;
            MaterialCost = spell.MaterialCost;
            Duration = spell.Duration;
            Source = spell.Source;
            Description = spell.Description;
            IsSave = spell.IsSave;
            IsAttack = spell.IsAttack;
            IsConcentration = spell.IsConcentration;
            IsRitual = spell.IsRitual;
            AtHigherLevels = spell.AtHigherLevels;
            DmgDiceNum = spell.DmgDiceNum;
            DmgDiceFaces = spell.DmgDiceFaces;
            DmgBonus = spell.DmgBonus;
            DmgType = spell.DmgType;
        }
    }
}
