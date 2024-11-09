using CharacterManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CharacterManager
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Creator_Loaded()
        {

        }

        //private void ListView_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        //{
        //    if (DataContext is CreationVM viewModel && viewModel.ClickedClass != null)
        //    {
        //        // Open pop-up window when an item is selected
        //        var popUp = new PopUpWindow(viewModel.ClickedClass);
        //        popUp.ShowDialog();
        //    }
        //}
    }
}
