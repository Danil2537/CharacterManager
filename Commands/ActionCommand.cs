using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Commands
{
    public class ActionCommand : CommandBase
    {
        private readonly Action<object> _execute;
        private readonly Func<object, bool> _canExecute;

        public ActionCommand(Action<object> execute, Func<object, bool> canExecute = null)
        {
            _execute = execute;
            _canExecute = canExecute;
        }

        public override void Execute(object parameter)
        {
            _execute?.Invoke(parameter);
        }

        public override bool CanExecute(object parameter)
        {
            return _canExecute == null || _canExecute(parameter);
        }

    }
}
