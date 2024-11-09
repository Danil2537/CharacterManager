using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{
    public enum FeatTypes { action, bonus_action, reaction, other };
    public class Feat
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string MultiClassInfo { get; set; }
        public bool HasOptions { get; set; }
        public List<int> OptionLevels { get; set; }
        public List<Tuple<string, string>> FeatOptions { get; set; }
        public FeatTypes Type { get; set; }
        public int UnlockAtLevel { get; set; }

        public Feat(string name, string description, FeatTypes type, int unlockAtLevel)
        {
            Name = name;
            Description = description;
            Type = type;
            UnlockAtLevel = unlockAtLevel;
        }
    }
}
