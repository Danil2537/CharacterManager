using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{
    public class User
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public List<Character> CharacterList { get; set; }
        public List<Subclass> CreatedSubclasses { get; set; }
        public List<Class> CreatedClasses { get; set; }
        public List<Species> CreatedSpecies { get; set; }
        public List<Item> CreatedItems { get; set; }
        public List<Feat> CreatedFeats { get; set; }

        public User()
        {
            UserName = "DefaultName";
            CharacterList = new List<Character>();
            CreatedSubclasses = new List<Subclass>();
            CreatedClasses = new List<Class>();
            CreatedSpecies = new List<Species>();
            CreatedItems = new List<Item>();
            CreatedFeats = new List<Feat>();
        }
        public User(string userName)
        {
            UserName = userName;
            CharacterList = new List<Character>();
            CreatedSubclasses = new List<Subclass>();
            CreatedClasses = new List<Class>();
            CreatedSpecies = new List<Species>();
            CreatedItems = new List<Item>();
            CreatedFeats = new List<Feat>();
        }
        public User(string userName, List<Character> userCharacters)
        {
            UserName = userName;
            CharacterList = userCharacters;
        }
        public User(string userName, List<Character> characterList, List<Subclass> createdCubclasses,
            List<Class> createdClasses, List<Species> createdSpecies, List<Item> createdItems,
            List<Feat> createdFeats)
        {
            UserName = userName;
            CharacterList = characterList;
            CreatedSubclasses = createdCubclasses;
            CreatedClasses = createdClasses;
            CreatedSpecies = createdSpecies;
            CreatedItems = createdItems;
            CreatedFeats = createdFeats;
        }
        public void AddCharacter(Character character)
        {
            this.CharacterList.Add(character);
        }
    }
}
