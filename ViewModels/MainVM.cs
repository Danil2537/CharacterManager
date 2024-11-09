using CharacterManager.Stores;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.ViewModels
{
    public class MainVM : ViewModelBase
    {
        private readonly NavigationStore _navigationStore;

        public ViewModelBase CurrentViewModel => _navigationStore.CurrentViewModel;

        public MainVM(NavigationStore navigationStore)
        {
            _navigationStore = navigationStore;
            _navigationStore.CurrentViewModelChanged += OnCurrentViewModelChanged;
        }

        private void OnCurrentViewModelChanged()
        {
            OnPropertyChanged(nameof(CurrentViewModel));
        }
    
    public MainVM()
        {
            //CurrentViewModel = new ProfileVM("Danilo", new Character("Theo", new Models.Class("Bard"), new Models.Species("Dwarf"), 3));
            //CurrentViewModel = new CreationVM();
            //CurrentViewModel = new LoginVM();
        }
    }
}
