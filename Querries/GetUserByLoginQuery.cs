using CharacterManager.DbContexts;
using CharacterManager.DTOs;
using CharacterManager.Models;
using CharacterManager.Views;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace CharacterManager.Querries
{
    public class GetUserByLoginQuery
    {
        private readonly CharacterManagerDbContextFactory _contextFactory;
        private readonly string _enteredLogin;
        private readonly string _enteredPassword;

        public GetUserByLoginQuery(CharacterManagerDbContextFactory contextFactory, string login, string password)
        {
            _contextFactory = contextFactory;
            _enteredLogin = login;
            _enteredPassword = password;
        }

        public async Task<IEnumerable<Models.User>> Execute()
        {
            using (CharacterManagerDbContext context = _contextFactory.CreateDbContext())
            {
                IEnumerable<UserDTO> userDTOs = await context.Users
                    .Include(u => u.CharacterList) // Include CharacterList
                    .Where(u => u.UserName == _enteredLogin && u.Password == _enteredPassword)
                    .ToListAsync();

                return userDTOs.Select(u => new Models.User(u.UserName, u.CharacterList.Select(c => new 
                Character
                ( c.Name, new Class("placeholder class"), new Species("placeholder species"), c.Level)).ToList()));
            }
        }
    }

}
