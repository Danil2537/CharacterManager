using CharacterManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Commands
{
    public class ChooseClassCommand : CommandBase
    {
        private readonly CreationVM _viewModel;

        public ChooseClassCommand(CreationVM viewModel)
        {
            _viewModel = viewModel;
        }

        public override void Execute(object parameter)
        {
            if (parameter is Models.Class selectedClass)
            {
                _viewModel.ChosenClass = selectedClass; // Set the chosen class here
            }
        }
    }
}
