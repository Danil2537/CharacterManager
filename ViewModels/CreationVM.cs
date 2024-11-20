using CharacterManager.Commands;
using CharacterManager.DbContexts;
using CharacterManager.Models;
using CharacterManager.Queries;
using CharacterManager.Stores;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls.Primitives;
using System.Windows.Input;

namespace CharacterManager.ViewModels
{

    public class CreationVM : ViewModelBase
    {
        public CharacterManagerDbContextFactory _contextFactory;
        private Class _chosenClass;
        private Species _chosenSpecies;
        //private List<Item> _startingEquipment;
        private Class _clickedClass;
        private Models.Species _clickedSpecies;
        private int _strength;
        private int _dexterity;
        private int _constitution;
        private int _intelligence;
        private int _wisdom;
        private int _charisma;
        private Background _chosenBackground;
        private Character _createdCharacter;
        public bool CanCreateCharacter;
       
        public ObservableCollection<Class> AvailableClasses { get; set; }
        public ObservableCollection<Species> AvailableSpecies { get; set; }
        public CommandBase ChooseClassCommand { get; }
        public CommandBase ChooseSpeciesCommand { get; }
        public CommandBase RollAbilityCommand { get; }
        public CommandBase SaveBackgroundCommand { get; }
        public Class ChosenClass
        {
            get { return _chosenClass; }
            set
            {
                _chosenClass = value;
                OnPropertyChanged(nameof(ChosenClass));
            }
        }
        public Species ChosenSpecies
        {
            get { return _chosenSpecies; }
            set
            {
                _chosenSpecies = value;
                OnPropertyChanged(nameof(ChosenSpecies));
            }
        }
        public Class ClickedClass
        {
            get { return _clickedClass; }
            set
            {
                _clickedClass = value;
                OnPropertyChanged(nameof(ClickedClass));
            }
        }
        public Species ClickedSpecies
        {
            get { return _clickedSpecies; }
            set
            {
                _clickedSpecies = value;
                OnPropertyChanged(nameof(ClickedSpecies));
            }
        }

        public int Strength
        {
            get { return _strength; }
            set
            {
                _strength = value;
                OnPropertyChanged(nameof(Strength));
            }
        }
        public int Dexterity
        {
            get { return _dexterity; }
            set
            {
                _dexterity = value;
                OnPropertyChanged(nameof(Dexterity));
            }
        }
        public int Constitution
        {
            get { return _constitution; }
            set
            {
                _constitution = value;
                OnPropertyChanged(nameof(Constitution));
            }
        }
        public int Intelligence
        {
            get { return _intelligence; }
            set
            {
                _intelligence = value;
                OnPropertyChanged(nameof(Intelligence));
            }
        }
        public int Wisdom
        {
            get { return _wisdom; }
            set
            {
                _wisdom = value;
                OnPropertyChanged(nameof(Wisdom));
            }
        }
        public int Charisma
        {
            get { return _charisma; }
            set
            {
                _charisma = value;
                OnPropertyChanged(nameof(Charisma));
            }
        }
        public string BackgroundTitle { get; set; }
        public string CharacterName { get; set; }
        public string BackgroundDescription { get; set; }
        public Skills BackgroundSkill1 { get; set; }
        public Skills BackgroundSkill2 { get; set; }
        //public List<Tools> BackgroundTools { get; set; } = new List<Tools>();
        public string BackgroundTools { get; set; }
        //public List<Languages> BackgroundLanguages { get; set; } = new List<Languages>();
        public string BackgroundLanguages { get; set; }
        public ObservableCollection<Item> BackgroundItems { get; set; } = new ObservableCollection<Item>();
        public string BackgroundIdeal { get; set; }
        public string BackgroundFlaw { get; set; }
        public string BackgroundBond { get; set; }
        public Feat SelectedFeat { get; set; }

        public Background ChosenBackground
        {
            get { return _chosenBackground; }
            set
            {
                _chosenBackground = value;
                OnPropertyChanged(nameof(ChosenBackground));
            }
        }

        public Character CreatedCharacter
        {
            get { return _createdCharacter; }
            set
            {
                _createdCharacter = value;
                OnPropertyChanged(nameof(CreatedCharacter));
            }
        }

        private List<Item> _selectedStartingItemsOption;
        public List<Item> SelectedStartingItemsOption
        {
            get => _selectedStartingItemsOption;
            set
            {
                _selectedStartingItemsOption = value;
                OnPropertyChanged(nameof(SelectedStartingItemsOption));
            }
        }

        private ObservableCollection<Item> _availableBackgroundItems;
        private ObservableCollection<Item> _selectedBackgroundItems;

        public ObservableCollection<Item> AvailableBackgroundItems
        {
            get { return _availableBackgroundItems; }
            set 
            { 
                _availableBackgroundItems = value;
                OnPropertyChanged(nameof(AvailableBackgroundItems)); 
            }
        }

        public ObservableCollection<Item> SelectedBackgroundItems
        {
            get { return _selectedBackgroundItems; }
            set 
            {
                _selectedBackgroundItems = value;
                OnPropertyChanged(nameof(SelectedBackgroundItems)); 
            }
        }
        private Item _selectedAvailableItem;
        public Item SelectedAvailableItem
        {
            get { return _selectedAvailableItem; }
            set
            {
                _selectedAvailableItem = value;
                OnPropertyChanged(nameof(SelectedAvailableItem));
                // Notify the command that its CanExecute state may have changed
                //((ActionCommand)MoveToSelectedCommand).OnCanExecuteChanged();
            }
        }

        private Item _selectedSelectedItem;
        public Item SelectedSelectedItem
        {
            get { return _selectedSelectedItem; }
            set
            {
                _selectedSelectedItem = value;
                OnPropertyChanged(nameof(SelectedSelectedItem));
                // Notify the command that its CanExecute state may have changed
                ((ActionCommand)MoveToAvailableCommand).OnCanExecuteChanged();
            }
        }

        public ICommand MoveToSelectedCommand { get; }
        public ICommand MoveToAvailableCommand { get; }
        public ICommand CreateCharacterCommand { get; }
        public ICommand CancelCommand { get; }

        public async Task InitializeAsync()
        {
            try
            {
                // Створення об'єкта для виконання запиту на отримання всіх класів
                GetAllClassesQuery getAllClassesQuery = new GetAllClassesQuery(_contextFactory);

                // Очікуємо завершення виконання запиту
                await getAllClassesQuery.ExecuteAsync();

                // Оновлюємо колекцію класів з отриманими даними
                AvailableClasses = new ObservableCollection<Class>(getAllClassesQuery.Classes);

                // Логування кількості завантажених класів
                Console.WriteLine("Classes loaded: " + AvailableClasses.Count);
            }
            catch (Exception ex)
            {
                // Логування помилки, якщо вона виникла під час завантаження класів
                Console.WriteLine("Error loading classes: " + ex.Message);
            }
        }

        public static async Task<CreationVM> CreateAsync(Services.NavigationService navigationService, CharacterManagerDbContextFactory contextFactory, User user)
        {
            // Створення об'єкта CreationVM асинхронно
            var viewModel = await CreationVM.CreateAsync(navigationService, contextFactory, user);

            // Очікуємо завершення завантаження даних для ініціалізації
            await viewModel.InitializeAsync();
            return viewModel;
        }

        public CreationVM(Services.NavigationService navigationService, CharacterManagerDbContextFactory contextFactory, User user)
        {
            // Збереження переданого контексту бази даних
            _contextFactory = contextFactory;

            // Ініціалізація колекцій до завантаження даних
            AvailableClasses = new ObservableCollection<Class>();
            AvailableSpecies = new ObservableCollection<Species>();

            // Ініціалізація команд для різних дій
            ChooseClassCommand = new ActionCommand(ChooseClass);
            ChooseSpeciesCommand = new ActionCommand(ChooseSpecies);
            RollAbilityCommand = new ActionCommand(RollAbility);
            MoveToSelectedCommand = new ActionCommand(MoveToSelected);
            SaveBackgroundCommand = new ActionCommand(SaveBackground);
            MoveToAvailableCommand = new ActionCommand(MoveToAvailable);
            CreateCharacterCommand = new CreateCharacterCommand(this, user, navigationService);
            CancelCommand = new NavigateCommand(navigationService);

            // Ініціалізація асинхронних даних
            InitializeAsync();
        }


        public CreationVM(ObservableCollection<Species> availableSpecies, ObservableCollection<Class> availableClasses)
        {
            AvailableSpecies = availableSpecies;
            AvailableClasses = availableClasses;
            ChooseClassCommand = new ActionCommand(ChooseClass);
            ChooseSpeciesCommand = new ActionCommand(ChooseSpecies);
            RollAbilityCommand = new ActionCommand(RollAbility);
        }
        private void SelectClass(object obj)
        {
            if (obj is Models.Class selectedClass)
            {
                ClickedClass = selectedClass;
            }
        }
        private void ChooseClass(object obj)
        {
            if (obj is Models.Class chosenClass)
            {
                ChosenClass = chosenClass;
            }
        }
        private void ChooseSpecies(object obj)
        {
            if (obj is Models.Species chosenSpecies)
            {
                ChosenSpecies = chosenSpecies;
            }
        }
        private void RollAbility(object obj)
        {
            if (obj is string abilityName)
            {
                Dice abilityDice = new Dice();
                int abilityScore = abilityDice.RollAbility();

                switch (abilityName)
                {
                    case "Strength":
                        Strength = abilityScore;
                        break;
                    case "Dexterity":
                        Dexterity = abilityScore;
                        break;
                    case "Constitution":
                        Constitution = abilityScore;
                        break;
                    case "Intelligence":
                        Intelligence = abilityScore;
                        break;
                    case "Wisdom":
                        Wisdom = abilityScore;
                        break;
                    case "Charisma":
                        Charisma = abilityScore;
                        break;
                    default:
                        throw new ArgumentException("Invalid ability name", nameof(abilityName));
                }
            }
        }

        private void MoveToSelected(object obj)
        {

                SelectedBackgroundItems.Add(SelectedAvailableItem);
                AvailableBackgroundItems.Remove(SelectedAvailableItem);

        }

        private bool CanMoveToSelected() => SelectedAvailableItem != null;

        private void MoveToAvailable(object obj)
        {

                AvailableBackgroundItems.Add(SelectedSelectedItem);
                SelectedBackgroundItems.Remove(SelectedSelectedItem);

        }

     
        private void SaveBackground(object obj)
        {
            ChosenBackground = new Background(BackgroundTitle, BackgroundDescription, BackgroundSkill1, 
                BackgroundSkill2, BackgroundTools, BackgroundLanguages, new List<Item>(SelectedBackgroundItems),
                BackgroundIdeal, BackgroundBond, BackgroundFlaw);
        }
    }
}
