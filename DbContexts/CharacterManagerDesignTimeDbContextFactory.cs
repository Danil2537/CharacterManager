using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DbContexts
{
    public class CharacterManagerDesignTimeDbContextFactory : IDesignTimeDbContextFactory<CharacterManagerDbContext>
    {
        public CharacterManagerDbContext CreateDbContext(string[] args)
        {
            DbContextOptions options = new DbContextOptionsBuilder().UseSqlite("Data Source=CharacterManager.db").Options;
            return new CharacterManagerDbContext(options);
        }
    }
}
