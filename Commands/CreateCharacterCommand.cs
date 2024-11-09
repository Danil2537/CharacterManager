using CharacterManager.DbContexts;
using CharacterManager.Models;
using CharacterManager.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Navigation;

namespace CharacterManager.Commands
{
    public class CreateCharacterCommand : CommandBase
    {
        private readonly CreationVM _creationVM;
        private readonly User _user;
        Services.NavigationService _profileNavigation;

        public CreateCharacterCommand(CreationVM creationVM, User user, Services.NavigationService profileNavigation)
        {
            _creationVM = creationVM;
            _user = user;
            _creationVM.PropertyChanged += OnViewModelPropertyChanged;
            _profileNavigation = profileNavigation;
        }

        public override async void Execute(object parameter)
        {
            Character newCharacter = new Character(_creationVM.CharacterName, _creationVM.ChosenClass, _creationVM.ChosenSpecies, 1);

            newCharacter.SetAbilities(_creationVM.Strength, _creationVM.Dexterity, _creationVM.Constitution,
                _creationVM.Intelligence, _creationVM.Wisdom, _creationVM.Charisma);
            newCharacter.SetSkills();
            // Assign background
            newCharacter.Background = new Background(
                _creationVM.BackgroundTitle,
                _creationVM.BackgroundDescription,
                _creationVM.BackgroundSkill1,
                _creationVM.BackgroundSkill2,
               _creationVM.BackgroundTools,
               _creationVM.BackgroundLanguages,
               _creationVM.BackgroundItems.ToList(),
              _creationVM.BackgroundIdeal,
              _creationVM.BackgroundBond,
               _creationVM.BackgroundFlaw
            );

            // Assign proficient skills from the background
            newCharacter.AddSkillProficiency(_creationVM.BackgroundSkill1);
            newCharacter.AddSkillProficiency(_creationVM.BackgroundSkill2);

            // Add starting equipment to inventory
            if (_creationVM.SelectedStartingItemsOption != null)
            {
                foreach (var item in _creationVM.SelectedStartingItemsOption)
                {
                    newCharacter.Inventory.Add(item);
                }
            }

            // Add background items to inventory
            if (_creationVM.SelectedBackgroundItems != null)
            {
                foreach (var item in _creationVM.SelectedBackgroundItems)
                {
                    newCharacter.Inventory.Add(item);
                }
            }
            newCharacter.ArmorClass = 10 + newCharacter.GetModifier(newCharacter.GetAbility(Abilities.Dexterity));
            newCharacter.Speed = newCharacter.CharSpecies.Speed;
            newCharacter.InitiativeBonus = newCharacter.GetModifier(newCharacter.GetAbility(Abilities.Dexterity));
            newCharacter.Level = 1;
            newCharacter.MaxHealth = new Models.Dice(newCharacter.CharClass.HitDieNumber,
                newCharacter.CharClass.HitDieType,
                newCharacter.GetModifier(newCharacter.GetAbility(Abilities.Constitution))).Roll();
            newCharacter.CurrentHealth = newCharacter.MaxHealth;

            try
            {
                _user.AddCharacter(newCharacter);
                var query = new InsertNewUserCharacterQuery(_creationVM._contextFactory, _user, newCharacter);
                await query.ExecuteAsync();
                MessageBox.Show("Successfully Created a Character.", "Success",
                    MessageBoxButton.OK, MessageBoxImage.Information);
                _profileNavigation.Navigate(_user);
            }
            catch (Exception)
            {
                MessageBox.Show("Can't create Character.", "Error",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        private void OnViewModelPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(CreationVM.CanCreateCharacter))
            {
                OnCanExecuteChanged();
            }
        }
    }
}
