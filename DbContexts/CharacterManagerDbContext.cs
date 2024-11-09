using CharacterManager.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CharacterManager.DbContexts
{
    public class CharacterManagerDbContext : DbContext
    {
        public CharacterManagerDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<UserDTO> Users { get; set; }
        public DbSet<CharacterDTO> Characters { get; set; }
        public DbSet<BackgroundDTO> Backgrounds { get; set; }
        public DbSet<ClassDTO> Classes { get; set; }
        public DbSet<DiceDTO> Dice { get; set; }
        public DbSet<FeatDTO> Feats { get; set; }
        public DbSet<ItemDTO> Items { get; set; }
        public DbSet<SpeciesDTO> Species { get; set; }
        public DbSet<SpellDTO> Spells { get; set; }
        public DbSet<SubclassDTO> Subclasses { get; set; }
         
    }
}
