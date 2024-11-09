using CharacterManager.AsyncCommands;
using CharacterManager.Commands;
using CharacterManager.DbContexts;
using CharacterManager.Querries;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace CharacterManager.ViewModels
{
    public class LoginVM : ViewModelBase
    {
        private CharacterManagerDbContextFactory _contextFactory;
        private string _errors;
        public string Errors
        {
            get { return _errors; }
            set
            {
                _errors = value;
                OnPropertyChanged(nameof(Errors));
            }
        }

        private string _enteredUsername = "";
        public string EnteredUsername
        {
            get
            {
                return _enteredUsername;
            }
            set
            {
                _enteredUsername = value;
                OnPropertyChanged(nameof(EnteredUsername));
            }
        }

        private string _enteredPassword = "";
        public string EnteredPassword
        {
            get
            {
                return _enteredPassword;
            }
            set
            {
                _enteredPassword = value;
                OnPropertyChanged(nameof(EnteredPassword));
            }
        }

        public CommandBase LoginCommand { get; }
        public CommandBase RegisterCommand { get; }
        public ICommand EnterProfileCommand { get; }

        public LoginVM(Services.NavigationService profileNavigationService, Services.NavigationService registrationNavigationService, CharacterManagerDbContextFactory contextFactory)
        {
            _contextFactory = contextFactory;

            LoginCommand = new AsyncActionCommand(LoginAsync);
            //RegisterCommand = new ActionCommand(Register);
            EnterProfileCommand = new NavigateCommand(profileNavigationService);
            RegisterCommand = new NavigateCommand(registrationNavigationService);
        }

        private async Task LoginAsync(object obj)
        {
            var query = new GetUserByLoginQuery(_contextFactory, EnteredUsername, EnteredPassword);
            var users = await query.Execute();

            if (users.Any())
            {
                var user = users.First();
                EnterProfileCommand.Execute(user);
            }
            else
            {
                Errors = "Invalid username or password.";
            }
        }
    }
}
