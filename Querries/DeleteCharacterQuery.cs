using CharacterManager.DbContexts;
using CharacterManager.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CharacterManager.Querries
{
    public class DeleteCharacterQuery
    {
        private readonly CharacterManagerDbContextFactory _contextFactory;
        private readonly Character _character;

        public DeleteCharacterQuery(CharacterManagerDbContextFactory contextFactory, Character character)
        {
            _contextFactory = contextFactory;
            _character = character;
        }

        public async Task Execute()
        {
            using (CharacterManagerDbContext context = _contextFactory.CreateDbContext())
            {
                CharacterDTO charDTO = await context.Characters
                    .FirstOrDefaultAsync(c => c.Name == _character.Name);
                if (charDTO != null)
                {
                    context.Remove(charDTO);
                    await context.SaveChangesAsync();
                }
                else
                {
                    throw new Exception("Character not found.");
                }
            }
        }
    }
}
