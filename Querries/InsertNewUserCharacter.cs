using CharacterManager.DbContexts;
using CharacterManager.DTOs;
using CharacterManager.AsyncCommands;
using CharacterManager.Models;
using CharacterManager;
using Microsoft.EntityFrameworkCore;


public class InsertNewUserCharacterQuery
{
    private readonly CharacterManagerDbContextFactory _contextFactory;
    private readonly User _user;
    private readonly Character _character;

    public InsertNewUserCharacterQuery(CharacterManagerDbContextFactory contextFactory, User user, Character character)
    {
        _contextFactory = contextFactory;
        _user = user;
        _character = character;
    }

    public async Task ExecuteAsync()
    {
        using (CharacterManagerDbContext context = _contextFactory.CreateDbContext())
        {
            UserDTO userDTO = await context.Users
                .FirstOrDefaultAsync(u => u.UserName == _user.UserName);

            if (userDTO == null)
            {
                throw new Exception("User does not exist in the database.");
            }

            CharacterDTO newCharacter = new CharacterDTO(_character)
            {
                CreatedByUser = userDTO,
                CreatedByUserId = userDTO.UserId
            };

            context.Add(newCharacter);

            await context.SaveChangesAsync();
        }
    }
}