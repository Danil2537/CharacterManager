using CharacterManager.Commands;
using CharacterManager.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace CharacterManager.ViewModels
{
    public class LvlUpVM : ViewModelBase
    {
        private Character _character;
        private int _rolledHP;
        private int _averageHP;
        private bool _hasAbilityScoreIncreaseOrFeat;
        private bool _hasSpells;

        public ObservableCollection<Feat> AvailableFeatures { get; set; }
        public ObservableCollection<Feat> AvailableFeats { get; set; }
        public ObservableCollection<Spell> AvailableSpells { get; set; }

        public ICommand RollHPCommand { get; }
        public ICommand SaveChoicesCommand { get; }
        public ICommand SelectFeatCommand { get; }
        public ICommand SelectSpellCommand { get; }
        public ICommand NavigateSheetCommand { get; }

        public int RolledHP
        {
            get { return _rolledHP; }
            set
            {
                _rolledHP = value;
                OnPropertyChanged(nameof(RolledHP));
            }
        }

        public int AverageHP
        {
            get { return _averageHP; }
            set
            {
                _averageHP = value;
                OnPropertyChanged(nameof(AverageHP));
            }
        }

        public bool HasAbilityScoreIncreaseOrFeat
        {
            get { return _hasAbilityScoreIncreaseOrFeat; }
            set
            {
                _hasAbilityScoreIncreaseOrFeat = value;
                OnPropertyChanged(nameof(HasAbilityScoreIncreaseOrFeat));
            }
        }

        public bool HasSpells
        {
            get { return _hasSpells; }
            set
            {
                _hasSpells = value;
                OnPropertyChanged(nameof(HasSpells));
            }
        }

        // Constructor
        public LvlUpVM(Services.NavigationService sheetNavigationService, Character character)
        {
            _character = character;

            // Initialize collections and commands
            AvailableFeatures = new ObservableCollection<Feat>();
            AvailableFeats = new ObservableCollection<Feat>();
            AvailableSpells = new ObservableCollection<Spell>();

            //RollHPCommand = new ActionCommand(RollHP);
            //SaveChoicesCommand = new RelayCommand(SaveChoices);
            //SelectFeatCommand = new RelayCommand(SelectFeat);
            //SelectSpellCommand = new RelayCommand(SelectSpell);

            LoadLevelUpOptions();

            NavigateSheetCommand = new NavigateCommand(sheetNavigationService);
        }

        // Loads options based on character's level-up requirements
        private void LoadLevelUpOptions()
        {
            // Determine HP options: average vs. roll
            AverageHP = CalculateAverageHP();
            RolledHP = 0; // Default until rolled

            // Fetch features, feats, and spells for this level
            LoadAvailableFeatures();
            LoadAvailableFeats();
            LoadAvailableSpells();

            // Check if ability score increase/feat is available at this level
            HasAbilityScoreIncreaseOrFeat = CheckForAbilityScoreIncreaseOrFeat();
            HasSpells = _character.CharClass.HaveSpells; // Example logic
        }

        private int CalculateAverageHP()
        {
            // Calculate average HP based on class, for example
            return _character.CharClass.HitDieType / 2 + 1;
        }

        private void RollHP()
        {
            // Logic to roll HP based on class hit die
            //RolledHP = new Random().Next(1, _character.Class.HitDie + 1);
        }

        private bool CheckForAbilityScoreIncreaseOrFeat()
        {
            // Determine if the character gains an ability score increase or feat at this level
            //return _character.Level % 4 == 0; // Example rule for D&D
            return false;
        }

        private void LoadAvailableFeatures()
        {
            //// Fetch class and subclass features available at the new level
            //var features = _character.Class.GetFeaturesForLevel(_character.Level);
            //foreach (var feature in features)
            //{
            //    AvailableFeatures.Add(feature);
            //}
        }

        private void LoadAvailableFeats()
        {
            //// Fetch available feats if the character can choose one
            //if (HasAbilityScoreIncreaseOrFeat)
            //{
            //    var feats = FeatRepository.GetAllFeats();
            //    foreach (var feat in feats)
            //    {
            //        AvailableFeats.Add(feat);
            //    }
            //}
        }

        private void LoadAvailableSpells()
        {
            //// Fetch available spells for the character if applicable
            //if (_character.HasSpellcasting)
            //{
            //    var spells = SpellRepository.GetAvailableSpells(_character);
            //    foreach (var spell in spells)
            //    {
            //        AvailableSpells.Add(spell);
            //    }
            //}
        }

        private void SelectFeat(object feat)
        {
            //// Logic for selecting a feat
            //var selectedFeat = feat as Feat;
            //_character.ChooseFeat(selectedFeat);
        }

        private void SelectSpell(object spell)
        {
            // Logic for selecting a spell
            //var selectedSpell = spell as Spell;
            //_character.PrepareSpell(selectedSpell);
        }

        private void SaveChoices()
        {
            // Save all level-up choices
            //if (RolledHP > 0)
            //{
            //    _character.IncreaseHitPoints(RolledHP);
            //}
            //else
            //{
            //    _character.IncreaseHitPoints(AverageHP);
            //}

            //// Save feats, features, spells, and other choices
            //_character.SaveLevelUpChoices();

            //// Navigate to character sheet or return to main screen
            //NavigateToCharacterSheet();
        }

        private void NavigateToCharacterSheet()
        {
            // Logic for navigating back to character sheet view
        }
    }
}
