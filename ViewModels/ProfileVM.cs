using CharacterManager.AsyncCommands;
using CharacterManager.Commands;
using CharacterManager.DbContexts;
using CharacterManager.Models;
using CharacterManager.Querries;
using CharacterManager.Stores;


namespace CharacterManager.ViewModels
{
    public class ProfileVM : ViewModelBase
    {
        private User _user;
        private CharacterManagerDbContextFactory _contextFactory;
        public User User
        {
            get
            {
                return _user;
            }
            set
            {
                _user = value;
                OnPropertyChanged(nameof(User));
            }
        }



        public void AddCharacter(Character character)
        {
            this._user.AddCharacter(character);
        }
        public async Task DeleteCharacter(object arg)
        {
            if (arg is Character characterToDelete)
            {
                var query = new DeleteCharacterQuery(_contextFactory, characterToDelete);
                await query.Execute();
                User.CharacterList.Remove(characterToDelete);
                OnPropertyChanged(nameof(User)); 
            }
        }

        public CommandBase CreateCharacterCommand { get; }
        public CommandBase DeleteCharacterCommand { get; }

        public ProfileVM(Services.NavigationService creationNavigationService, Services.NavigationService sheetNavigationService, User user, CharacterManagerDbContextFactory contextFactory)
        {
            _user = user;
            CreateCharacterCommand = new NavigateCommand(creationNavigationService, _user);
            DeleteCharacterCommand = new AsyncActionCommand(DeleteCharacter);
            _contextFactory = contextFactory;
        }
    }
}
