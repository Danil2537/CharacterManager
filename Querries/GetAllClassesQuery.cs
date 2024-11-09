using CharacterManager.DbContexts;
using CharacterManager.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Querries
{
    public class GetAllClassesQuery
    {
        private readonly CharacterManagerDbContextFactory _contextFactory;
        private readonly List<Models.Class> _classes;

        public GetAllClassesQuery(CharacterManagerDbContextFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task Execute()
        {
            using (CharacterManagerDbContext context = _contextFactory.CreateDbContext())
            {
                List<ClassDTO> classesDTO = await context.Classes.ToListAsync();
                foreach(ClassDTO classDTO in classesDTO) 
                {
                    this._classes.Add(new Models.Class(classDTO));
                }
            }
        }
    }
}
