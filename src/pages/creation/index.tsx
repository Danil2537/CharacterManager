"use client"
import Head from "next/head";
import Link from "next/link";
import { useState, createContext, useContext, type ReactNode, useEffect } from "react";
import { api, type RouterOutputs } from "../../utils/api";

// Character Creation Context
type CharacterCreationContextType = {
  selectedClass: number | null;
  selectedSpecies: number | null;
  selectedBackground: number | null;
  abilityScores: number[] | null;
  selectedEquipment: number[];
  setClass: (classObj: number) => void;
  setSpecies: (speciesObj: number) => void;
  setBackground: (backgroundObj: number) => void;
  setAbilityScores: (scores: number[]) => void;
  setEquipment: React.Dispatch<React.SetStateAction<number[]>>;
};

const CharacterCreationContext = createContext<CharacterCreationContextType | undefined>(undefined);

export const CharacterCreationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedSpecies, setSelectedSpecies] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [abilityScores, setAbilityScores] = useState<number[] | null>([0,0,0,0,0,0]);
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([]);

  return (
    <CharacterCreationContext.Provider value={{
      selectedClass, setClass: setSelectedClass,
      selectedSpecies, setSpecies: setSelectedSpecies,
      selectedBackground, setBackground: setSelectedBackground,
      abilityScores, setAbilityScores,
      selectedEquipment, setEquipment: setSelectedEquipment
    }}>
      {children}
    </CharacterCreationContext.Provider>
  );
};

const useCharacterCreation = () => {
  const context = useContext(CharacterCreationContext);
  if (!context) throw new Error("useCharacterCreation must be used within CharacterCreationProvider");
  return context;
};


export default function CharacterCreationPage() {
  return (
    <CharacterCreationProvider>
      <CharacterCreation />
    </CharacterCreationProvider>
  );
}



function CharacterCreation() {
  const [step, setStep] = useState(0);
  const { data: classes } = api.creation.getAllClasses.useQuery();
  const { data: species } = api.creation.getAllSpecies.useQuery();
  const { data: backgrounds } = api.creation.getAllBackgrounds.useQuery();
  const { selectedClass, setClass, selectedSpecies, setSpecies, selectedBackground, setBackground , selectedEquipment, setEquipment} = useCharacterCreation();
  const [scores, setScores] = useState({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  });
  const { mutateAsync: createCharacter } = api.creation.createCharacter.useMutation();

  const roll4d6DropLowest = (): number => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  if (rolls.length !== 4) throw new Error("Failed to generate four dice rolls.");
  rolls.sort((a, b) => b - a); // Sort descending
  return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0); // Sum of three highest
};

const [availableEquipment, setAvailableEquipment] = useState<{ id: number; name: string }[]>([]);
useEffect(() => {
    const classObj = classes?.find((cls) => cls.id === selectedClass);
    const backgroundObj = backgrounds?.find((bg) => bg.id === selectedBackground);

    const classEquipment = classObj?.startingEquipment || [];
    const backgroundEquipment = backgroundObj?.items || [];

    setAvailableEquipment([...classEquipment, ...backgroundEquipment]);
  }, [selectedClass, selectedBackground, classes, backgrounds]);

  const handleEquipmentToggle = (itemId: number) => {
    setEquipment( (prev) => 
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleScoreChange = (ability: keyof typeof scores, value: number) => {
    setScores((prev) => ({ ...prev, [ability]: value }));
  };

  // Handler for rolling a score
  const handleRoll = (ability: keyof typeof scores) => {
    const rolledValue = roll4d6DropLowest();
    setScores((prev) => ({ ...prev, [ability]: rolledValue }));
  };

  const submitCharacterCreation = async () => {
    try {
      if (
        selectedClass === null ||
        selectedSpecies === null ||
        selectedBackground === null ||
        !scores ||
        selectedEquipment.length === 0
      ) {
        alert("Please complete all steps before submitting.");
        return;
      }

      const data = {
        chosenClassId: selectedClass,
        chosenSpeciesId: selectedSpecies,
        chosenBackgroundId: selectedBackground,
        abilityScores: scores,
        chosenEquipmentIds: selectedEquipment,
      };

      console.log("Submitting character data:", data);
      await createCharacter(data);
      alert("Character created successfully!");
    } catch (error) {
      console.error("Failed to create character:", error);
      alert("Failed to create character. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Character Creation</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h2 className="text-2xl font-bold text-white">Character Creation (Step {step + 1})</h2>
          {step === 0 && (
            <div>
              <h3 className="text-xl text-white">Choose Your Class:</h3>
              <h4 className="text--xl text-blue-500">Your Selected Class is: {selectedClass}</h4>
              <ul>
                {classes?.map((classObj) => (
                  <li key={classObj.id} className="mt-2">
                    <button className="text-white" onClick={() => setClass(classObj.id)}>{classObj.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-xl text-white">Choose Your Species:</h3>
              <h4 className="text--xl text-blue-500">Your Selected Species is: {selectedSpecies}</h4>
              <ul>
                {species?.map((speciesObj) => (
                  <li key={speciesObj.id} className="mt-2">
                    <button className="text-white" onClick={() => setSpecies(speciesObj.id)}>{speciesObj.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl text-white">Choose Your Background:</h3>
              <h4 className="text--xl text-blue-500">Your Selected Background is: {selectedBackground}</h4>
              <ul>
                {backgrounds?.map((backgroundObj) => (
                  <li key={backgroundObj.id} className="mt-2">
                    <button className="text-white" onClick={() => setBackground(backgroundObj.id)}>{backgroundObj.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 text-white">
      <h2 className="text-2xl font-bold">Choose Your Ability Scores:</h2>
      <p className="text-lg">Enter values manually, use the standard array, or roll randomly.</p>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {Object.keys(scores).map((ability) => (
          <div key={ability} className="flex flex-col items-center">
            <label className="font-semibold">{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={scores[ability as keyof typeof scores]}
                onChange={(e) => handleScoreChange(ability as keyof typeof scores, Number(e.target.value))}
                className="w-16 p-2 text-black rounded"
                min={1}
                max={20}
              />
              <button
                onClick={() => handleRoll(ability as keyof typeof scores)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Roll
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-lg font-semibold">Current Scores:</p>
        <ul>
          {Object.entries(scores).map(([ability, value]) => (
            <li key={ability}>
              {ability.charAt(0).toUpperCase() + ability.slice(1)}: {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="text-xl text-white">Choose Your Equipment:</h3>
              <ul className="text-white">
                {availableEquipment.map((item) => ( //TODO: make a check to remove duplicated items
                  <li key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedEquipment.includes(item.id)}
                        onChange={() => handleEquipmentToggle(item.id)}
                      />
                      {item.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-4 mt-8">
            <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 text-white bg-gray-600 rounded">Previous</button>
            {step === 4 ? (
              <button onClick={submitCharacterCreation} className="px-4 py-2 text-white bg-green-600 rounded">Submit</button>
            ) : (
              <button onClick={nextStep} className="px-4 py-2 text-white bg-blue-600 rounded">Next</button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

