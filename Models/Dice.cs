using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CharacterManager.Models
{
    public class Dice
    {
        public int DiceNumber { get; }
        public int Faces { get; }
        public int Bonus { get; }

        public Dice() : this(1, 20, 0) { }

        public Dice(int diceNumber, int faces, int bonus)
        {
            DiceNumber = diceNumber;
            Faces = faces;
            Bonus = bonus;
        }

        public int Roll()
        {
            Random roll = new Random();
            int result = 0;
            for (int i = 0; i < DiceNumber; i++)
            {
                result += roll.Next(1, Faces + 1);
            }
            return result + Bonus;
        }

        public int Roll(int diceNumber, int faces, int bonus)
        {
            Random roll = new Random();
            int result = 0;
            for (int i = 0; i < diceNumber; i++)
            {
                result += roll.Next(1, faces + 1);
            }
            return result + bonus;
        }

        public int RollAbility()
        {
            Random roll = new Random();
            List<int> dice = new List<int>();

            // Roll 4 dice and add them to the list
            for (int i = 0; i < 4; i++)
            {
                dice.Add(roll.Next(1, 7));  // Add random value between 1 and 6
            }

            // Sort the dice in ascending order
            dice.Sort();

            // Sum the highest 3 values (discard the lowest one)
            int result = dice[1] + dice[2] + dice[3];

            return result;
        }


        public void DisplayDiceInfo()
        {
            Console.WriteLine($"{DiceNumber}d{Faces} + {Bonus}");
        }
    }
}
