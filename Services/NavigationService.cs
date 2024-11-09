using CharacterManager.Stores;
using CharacterManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Services
{
    public class NavigationService
    {
        private readonly NavigationStore _navigationStore;
        private readonly Func<object, ViewModelBase> _createViewModel;

        public NavigationService(NavigationStore navigationStore, Func<object, ViewModelBase> createViewModel)
        {
            _navigationStore = navigationStore;
            _createViewModel = createViewModel;
        }

        public void Navigate(object parameter = null)
        {
            _navigationStore.CurrentViewModel = _createViewModel(parameter);
        }
    }
}
