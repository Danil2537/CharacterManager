using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("FeatOptions")]
    public class FeatOptionDTO
    {
        [Key]
        public int FeatOptionId { get; set; }
        public string FeatOptionName { get; set;}
        public string FeatOptionDescription { get; set;}
        [ForeignKey("Feat")]
        public int BelongToFeat { get; set; }
        public virtual FeatDTO Feat { get; set; }
    }


    [Table("Feats")] 
    public class FeatDTO
    {
        [Key]
        public int FeatId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public string MultiClassInfo { get; set; }

        public bool HasOptions { get; set; }

        public FeatTypes Type { get; set; }

        public int UnlockAtLevel { get; set; }

        public virtual ICollection<FeatOptionDTO> FeatOptions { get; set; }
        public bool IsFromBackground { get; set; }
        [ForeignKey("Background")]
        public int BelongToBackground { get; set; }
        public BackgroundDTO Background { get; set; }

        public int? CreatedByUserId { get; set; }

        [ForeignKey("CreatedByUserId")]
        public UserDTO CreatedByUser { get; set; }

        public FeatDTO() { }

        public FeatDTO(Feat feat)
        {
            Name = feat.Name;
            Description = feat.Description;
            MultiClassInfo = feat.MultiClassInfo;
            HasOptions = feat.HasOptions;
            Type = feat.Type;
            UnlockAtLevel = feat.UnlockAtLevel;
        }
    }
}
