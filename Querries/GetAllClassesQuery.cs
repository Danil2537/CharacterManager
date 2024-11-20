using CharacterManager.DbContexts;
using CharacterManager.DTOs;
using CharacterManager.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CharacterManager.Queries
{
    public class GetAllClassesQuery
    {
        private readonly CharacterManagerDbContextFactory _contextFactory;

        public List<Class> Classes { get; private set; } = new List<Class>();

        public GetAllClassesQuery(CharacterManagerDbContextFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task ExecuteAsync()
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var classesDTO = await context.Classes.ToListAsync();
                Classes.Clear();

                foreach (var classDTO in classesDTO)
                {
                    Classes.Add(new Class(classDTO));
                }
            }
        }
    }
}
