using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.DbContexts
{
    public class CharacterManagerDbContextFactory
    {
        private readonly string _connectionString;

        public CharacterManagerDbContextFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public CharacterManagerDbContext CreateDbContext()
        {
            DbContextOptions options = new DbContextOptionsBuilder().UseSqlite(_connectionString).Options;

            return new CharacterManagerDbContext(options);
        }
    }
}
