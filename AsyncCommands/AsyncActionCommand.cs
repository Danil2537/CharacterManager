using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.AsyncCommands
{
    public class AsyncActionCommand : AsyncCommandBase
    {
        private readonly Func<object, Task> _execute; // Use Func<object, Task> for async actions
        private readonly Func<object, bool> _canExecute;

        public AsyncActionCommand(Func<object, Task> execute, Func<object, bool> canExecute = null)
        {
            _execute = execute;
            _canExecute = canExecute;
        }

        public override async Task ExecuteAsync(object parameter)
        {
            if (_execute != null)
            {
                await _execute(parameter); // Await the async action
            }
        }

        public override bool CanExecute(object parameter)
        {
            return (_canExecute == null || _canExecute(parameter)) && base.CanExecute(parameter);
        }
    }
}
