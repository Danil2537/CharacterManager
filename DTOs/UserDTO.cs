using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DTOs
{
    [Table("Users")]
    public class UserDTO //DTO = Data Transfer Object
    {
        public UserDTO(string enteredLogin, string enteredPassword, string enteredEmail)
        {
            this.UserId = new Random().Next();
            this.UserName = enteredLogin;
            this.Password = enteredPassword;
            this.Email = enteredEmail;
        }
        public UserDTO() { }
        public UserDTO(UserDTO userDTO) 
        {
            this.UserId = userDTO.UserId;
            this.UserName = userDTO.UserName;
            Password = userDTO.Password;
            Email = userDTO.Email;
            CharacterList = userDTO.CharacterList;
            CreatedSubclasses = userDTO.CreatedSubclasses;
            CreatedClasses = userDTO.CreatedClasses;
            CreatedSpecies = userDTO.CreatedSpecies;
            CreatedItems = userDTO.CreatedItems;
            CreatedFeats = userDTO.CreatedFeats;
        }
        public UserDTO(Models.User user)
        {
            this.UserId = new Random().Next();
            this.UserName = user.UserName;
            Password = user.Password;
            Email = user.Email;
        }

        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public List<CharacterDTO> CharacterList { get; set; } = new List<CharacterDTO>();
        public List<SubclassDTO> CreatedSubclasses { get; set; } = new List<SubclassDTO>();
        public List<ClassDTO> CreatedClasses { get; set; } = new List<ClassDTO>();
        public List<SpeciesDTO> CreatedSpecies { get; set; } = new List<SpeciesDTO>();
        public List<ItemDTO> CreatedItems { get; set; } = new List<ItemDTO>();
        public List<FeatDTO> CreatedFeats { get; set; } = new List<FeatDTO>();
    }
}
