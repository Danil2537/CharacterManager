using CharacterManager.DbContexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Querries
{
    public class InsertNewUserQuery
    {
        private readonly CharacterManagerDbContextFactory _contextFactory;
        private readonly string _enteredLogin;
        private readonly string _enteredPassword;
        private readonly string _enteredEmail;

        public InsertNewUserQuery(CharacterManagerDbContextFactory contextFactory, string login, string password, string enteredEmail)
        {
            _contextFactory = contextFactory;
            _enteredLogin = login;
            _enteredPassword = password;
            _enteredEmail = enteredEmail;
        }

        public async Task ExecuteAsync()
        {
            using (CharacterManagerDbContext context = _contextFactory.CreateDbContext())
            {
                DTOs.UserDTO newUser = new DTOs.UserDTO(_enteredLogin, _enteredPassword, _enteredEmail);
                context.Add(newUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
