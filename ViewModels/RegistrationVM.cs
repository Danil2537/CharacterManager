using CharacterManager.AsyncCommands;
using CharacterManager.Commands;
using CharacterManager.DbContexts;
using CharacterManager.Querries;
using CharacterManager.Stores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.ViewModels
{
    public class RegistrationVM : ViewModelBase
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


        private string _enteredEmail = "";
        public string EnteredEmail
        {
            get
            {
                return _enteredEmail;
            }
            set
            {
                _enteredEmail = value;
                OnPropertyChanged(nameof(EnteredEmail));
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


        private string _repeatedPassword = "";
        public string RepeatedPassword
        {
            get
            {
                return _repeatedPassword;
            }
            set
            {
                _repeatedPassword = value;
                OnPropertyChanged(nameof(RepeatedPassword));
            }
        }
        public AsyncCommandBase RegisterCommand { get; }
        public CommandBase LoginCommand { get; }
        private void Register(object obj)
        {

        }
        private async Task RegisterAsync(object obj)
        {
            var query = new InsertNewUserQuery(_contextFactory, EnteredUsername, EnteredPassword, EnteredEmail);
            if(EnteredPassword == RepeatedPassword)
            {
                 await query.ExecuteAsync(); 
            }
            else { Errors = "Passwords don't match!"; }
        }
        public RegistrationVM(Services.NavigationService loginNavigationService, CharacterManagerDbContextFactory contextFactory)
        {
            RegisterCommand = new AsyncActionCommand(RegisterAsync);
            LoginCommand = new NavigateCommand(loginNavigationService);
            _contextFactory = contextFactory;
        }
    }
}
