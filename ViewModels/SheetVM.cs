using CharacterManager.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Navigation;

namespace CharacterManager.ViewModels
{
    public class SheetVM : ViewModelBase
    {
        public ICommand navigateProfileCommand { get; }
        public ICommand navigateLvlupCommand { get; }

        public SheetVM(Services.NavigationService profileNavigationService, Services.NavigationService lvlupNavigationService)
        {
            navigateProfileCommand = new NavigateCommand(profileNavigationService);
            navigateLvlupCommand = new NavigateCommand(lvlupNavigationService);
        }
    }
}
