using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{
    public class Background
    {
        public string Title { get; }
        public string CharacterName { get; }
        public string Description { get;  }
        public Feat BackgroundFeat { get; }
        public Skills BackgroundSkill1 { get; }
        public Skills BackgroundSkill2 { get; }
        public string BackgroundTools { get; }
        public string BackgroundLanguages { get; }
        public List<Item> Items { get; }
        public string BackgroundIdeal { get; }
        public string BackgroundBond { get; }
        public string BackgroundFlaw { get; }

        public Background(string backgroundTitle, string backgroundDescription, Skills backgroundSkill1, Skills backgroundSkill2, string backgroundTools, string backgroundLanguages, List<Item> items, string backgroundIdeal, string backgroundBond, string backgroundFlaw)
        {
            Title = backgroundTitle;
            Description = backgroundDescription;
            BackgroundSkill1 = backgroundSkill1; 
            BackgroundSkill2= backgroundSkill2;
            BackgroundTools = backgroundTools;
            BackgroundLanguages = backgroundLanguages;
            Items = items;
            BackgroundIdeal = backgroundIdeal;
            BackgroundBond = backgroundBond;
            BackgroundFlaw = backgroundFlaw;
        }
    }
}
