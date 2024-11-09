using CharacterManager.DbContexts;
using CharacterManager.Models;
using CharacterManager.Stores;
using CharacterManager.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace CharacterManager
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private readonly NavigationStore _navigationStore;
        private readonly CharacterManagerDbContextFactory _contextFactory;
        private const string CONNECTION_STRING = @"Data Source=C:\Documents\Labs\CharacterManager\charactermanager.db";

        public App()
        {
            _contextFactory = new CharacterManagerDbContextFactory(CONNECTION_STRING);
            _navigationStore = new NavigationStore();
        }
        protected override void OnStartup(StartupEventArgs e)
        {
            DbContextOptions options = new DbContextOptionsBuilder().UseSqlite(CONNECTION_STRING).Options;
            using (CharacterManagerDbContext dbContext = new CharacterManagerDbContext(options))
            {
                dbContext.Database.Migrate();
            }

            //_navigationStore.CurrentViewModel = CreateProfileVM(123);
            //_navigationStore.CurrentViewModel = new ProfileVM(new Services.NavigationService(_navigationStore, CreateCreationVM),
            //    new Services.NavigationService(_navigationStore, CreateSheetVM), new Models.User("Danil",
            //    new List<Character> { new Character("Theodan", new Models.Class("bard"), new Models.Species("dwarf"), 1) }));
            
            _navigationStore.CurrentViewModel = new LoginVM(new Services.NavigationService(_navigationStore, CreateProfileVM),
            new Services.NavigationService(_navigationStore, CreateRegistrationVM), _contextFactory);
            MainWindow = new MainWindow
            {
                DataContext = new MainVM(_navigationStore)
            };
            MainWindow.Show();

            base.OnStartup(e);
        }
        private ViewModelBase CreateCreationVM(object parameter)
        {
            return new CreationVM(new Services.NavigationService(_navigationStore, CreateProfileVM), _contextFactory, parameter as User);
        }
        private ViewModelBase CreateProfileVM(object parameter)
        {
            return new ProfileVM(new Services.NavigationService(_navigationStore, CreateCreationVM),
                new Services.NavigationService(_navigationStore, CreateSheetVM), parameter as User, _contextFactory);

        }
        private ViewModelBase CreateLvlUpVM(object parameter)
        {
            return new LvlUpVM(new Services.NavigationService(_navigationStore, CreateSheetVM), new Character("Theodan", new Models.Class("bard"), new Models.Species("dwarf"), 1));
        }
        private ViewModelBase CreateSheetVM(object parameter)
        {
            return new SheetVM(new Services.NavigationService(_navigationStore, CreateProfileVM), new Services.NavigationService(_navigationStore, CreateLvlUpVM));
        }
        private ViewModelBase CreateLoginVM(object parameter)
        {
            return new LoginVM(new Services.NavigationService(_navigationStore, CreateProfileVM), new Services.NavigationService(_navigationStore, CreateRegistrationVM), _contextFactory);
        }
        private ViewModelBase CreateRegistrationVM(object parameter)
        {
            return new RegistrationVM(new Services.NavigationService(_navigationStore, CreateLoginVM), _contextFactory);
        }

    }
}
