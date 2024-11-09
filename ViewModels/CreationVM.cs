using CharacterManager.Commands;
using CharacterManager.DbContexts;
using CharacterManager.Models;
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
        
        public CreationVM(Services.NavigationService navigationService, CharacterManagerDbContextFactory contextFactory, User user)
        {
            _contextFactory = contextFactory;
            Feat feat1 = new Feat("Rage", "You can enter a rage as a bonus action.", FeatTypes.bonus_action, 1);
            Feat feat2 = new Feat("Unarmored Defense", "Your AC equals 10 + Dexterity modifier + Constitution modifier.", FeatTypes.other, 1);


            // Creating Subclass objects
            Subclass berserker = new Subclass("Path of the Berserker", "Frenzied rage.", "A barbarian who channels rage into a powerful frenzy.",
                Abilities.Strength, false, new List<Spell>(), false, new List<Spell>());
            Subclass evocation = new Subclass("School of Evocation", "Master of destructive spells.", "A wizard who specializes in powerful evocation spells.",
                Abilities.Intelligence, true, new List<Spell>(), true, new List<Spell>());

            // Sample items
            Item item1 = new Gear("Explorer's Pack", "A pack containing essential supplies.");
            Item item2 = new Gear("Dungeoneer's Pack", "A pack with equipment for dungeon exploration.");
            Item item3 = new Gear("Arcane Focus", "A focus used for casting spells.");

            // Create starting items options for Barbarian and Wizard
            ObservableCollection<List<Item>> barbarianStartingItems = new ObservableCollection<List<Item>>
            {
                new List<Item> { item1, item2 }, // Option 1
                new List<Item> { item1 } // Option 2
            };

            ObservableCollection<List<Item>> wizardStartingItems = new ObservableCollection<List<Item>>
            {
                new List<Item> { item3 }, // Option 1
                new List<Item> { item2, item3 } // Option 2
            };

            AvailableBackgroundItems = new ObservableCollection<Item>
            {
                new Weapon("Shortsword", "A little longer than a dagger steel sword",10,20,false, "weapon", "Piercing", 1,6,false, 5, "Melee Weapon"),
                new Potion("Health Potion", "Restores 4d4 hit points", 2, 50, true, "potion", "Restores Health", 0),
                new Armor("Shield", "A round buckler shield with a heraldic symbol of Tempus on it", 15, 20, false, "Armor", 2, "Shield", true)
            };

            SelectedBackgroundItems = new ObservableCollection<Item>();

            // Creating Class objects with StartingItemsOptions
            Class barbarian = new Class("Barbarian", "PHB", "A warrior who can channel their rage.",
                Abilities.Strength, 12, 1, 3, "Choose a path at 3rd level.",
                new List<int> { 4, 8, 12, 16, 19 }, false, 2, new List<Skills> { Skills.Athletics, Skills.Acrobatics },
                new List<Feat> { feat1, feat2 }, new Dice(5,4,0), new HashSet<Abilities> { Abilities.Strength, Abilities.Constitution },
                barbarianStartingItems);
            barbarian.AddAvailableSubclass(berserker);

            Class wizard = new Class("Wizard", "PHB", "A scholar of arcane magic.",
                Abilities.Intelligence, 6, 1, 2, "Choose a school of magic at 2nd level.",
                new List<int> { 4, 8, 12, 16, 19 }, true, 2, new List<Skills> { Skills.Arcana, Skills.History },
                new List<Feat>(), new Dice(5, 4, 0), new HashSet<Abilities> { Abilities.Intelligence, Abilities.Wisdom },
                wizardStartingItems);
            wizard.AddAvailableSubclass(evocation);

            // Creating Species objects
            Species human = new Species("Human", "Versatile and ambitious.", "PHB", Sizes.medium, 30, 0, 0, 0, 1,
                new List<string> { "Common" });
            Species elf = new Species("Elf", "Graceful and magical.", "PHB", Sizes.medium, 30, 0, 0, 60, 2,
                new List<string> { "Common", "Elvish" });

            AvailableClasses = new ObservableCollection<Models.Class>
            {
                barbarian, wizard
            };
            AvailableSpecies = new ObservableCollection<Models.Species>
            {
                human, elf
            };

            ChooseClassCommand = new ActionCommand(ChooseClass);
            ChooseSpeciesCommand = new ActionCommand(ChooseSpecies);
            RollAbilityCommand = new ActionCommand(RollAbility);
            MoveToSelectedCommand = new ActionCommand(MoveToSelected);
            SaveBackgroundCommand = new ActionCommand(SaveBackground);
            MoveToAvailableCommand = new ActionCommand(MoveToAvailable);
            CreateCharacterCommand = new CreateCharacterCommand(this, user, navigationService);
            CancelCommand = new NavigateCommand(navigationService);
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
