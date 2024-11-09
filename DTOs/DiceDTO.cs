using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Dice")]
    public class DiceDTO
    {
        [Key]
        public int DiceId { get; set; }
        public int DiceNumber { get; set; }
        public int Faces { get; set; }
        public int Bonus { get; set; }

        public DiceDTO() { }

        public DiceDTO(Models.Dice dice)
        {
            DiceNumber = dice.DiceNumber;
            Faces = dice.Faces;
            Bonus = dice.Bonus;
        }
    }
}
