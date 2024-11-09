using CharacterManager.Services;
using CharacterManager.Stores;
using CharacterManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Commands
{
    public class NavigateCommand : CommandBase
    {
        private readonly NavigationService _navigationService;
        private readonly object _parameter;

        public NavigateCommand(NavigationService navigationService, object parameter = null)
        {
            _navigationService = navigationService;
            _parameter = parameter;
        }

        public override void Execute(object parameter)
        {
            _navigationService.Navigate(_parameter ?? parameter);
        }
    }
}
