using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    public class BackgroundDTO
    {
        public BackgroundDTO() { }

        public BackgroundDTO(Background background)
        {
            Title = background.Title;
            CharacterName = background.CharacterName;
            Description = background.Description;
            BackgroundTools = background.BackgroundTools;
            BackgroundLanguages = background.BackgroundLanguages;
            BackgroundIdeal = background.BackgroundIdeal;
            BackgroundBond = background.BackgroundBond;
            BackgroundFlaw = background.BackgroundFlaw;
            Items = background.Items.ConvertAll(item => new ItemDTO(item)); 
            //BackgroundFeat = new FeatDTO(background.BackgroundFeat);
        }
        [Key]
        public int BackgroundId { get; set; }
        public string Title { get; set; }
        public string CharacterName { get; set; }
        public string Description { get; set; }
        public string BackgroundTools { get; set; }
        public string BackgroundLanguages { get; set; }
        public string BackgroundIdeal { get; set; }
        public string BackgroundBond { get; set; }
        public string BackgroundFlaw { get; set; }

        // Navigation properties
        public virtual ICollection<ItemDTO> Items { get; set; } = new List<ItemDTO>();
        public virtual FeatDTO BackgroundFeat { get; set; }
    }
}
