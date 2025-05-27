"use client"
import Head from "next/head";
import { useState, createContext, useContext, type ReactNode, useEffect } from "react";
import { api, type RouterOutputs } from "../../utils/api";
import { Ability, Language, type Skill } from "@prisma/client";
import { useRouter } from "next/navigation";
type CharacterClass = RouterOutputs["creation"]["getAllClasses"][number];
type Species = RouterOutputs["creation"]["getAllSpecies"][number];
type Background = RouterOutputs["creation"]["getAllBackgrounds"][number];

type CharacterCreationContextType = {
  selectedClass: CharacterClass | null;
  selectedSpecies: Species | null;
  selectedBackground: Background | null;
  abilityScores: number[] | null;
  selectedEquipment: number[];
  setClass: (classObj: CharacterClass) => void;
  setSpecies: (speciesObj: Species) => void;
  setBackground: (backgroundObj: Background) => void;
  setAbilityScores: (scores: number[]) => void;
  setEquipment: React.Dispatch<React.SetStateAction<number[]>>;
};

const CharacterCreationContext = createContext<CharacterCreationContextType | undefined>(undefined);

export const CharacterCreationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [abilityScores, setAbilityScores] = useState<number[] | null>([0, 0, 0, 0, 0, 0]);
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

const allLanguages = Object.values(Language);


function CharacterCreation() {
  const router = useRouter();
  const [languageChoices, setLanguageChoices] = useState<Language[]>([]);
  const [backgroundBoostMode, setBackgroundBoostMode] = useState<"threeOnes" | "twoAndOne" | null>(null);
  const [abilityBoosts, setAbilityBoosts] = useState<Record<string, number>>({});
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
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [characterName, setCharacterName] = useState<string>("");
  const [availableEquipment, setAvailableEquipment] = useState<{ id: number; name: string }[]>([]);

   const handleEquipmentToggle = (itemId: number) => {
    setEquipment( (prev) => 
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };
  const { mutateAsync: createCharacter } = api.creation.createCharacter.useMutation();

  const roll4d6DropLowest = (): number => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  if (rolls.length !== 4) throw new Error("Failed to generate four dice rolls.");
  rolls.sort((a, b) => b - a); // Sort descending
  return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0); // Sum of three highest
};

  useEffect(() => {
  const classEquipment = selectedClass?.startingEquipment ?? [];
  const backgroundEquipment = selectedBackground?.items ?? [];

  const uniqueItems = Array.from(new Map(
    [...classEquipment, ...backgroundEquipment].map(item => [item.id, item])
  ).values());

  setAvailableEquipment(uniqueItems);
  }, [selectedClass, selectedBackground]);

  useEffect(() => {
  if (backgroundBoostMode === "threeOnes" && selectedBackground) {
    const boosts = Object.fromEntries(selectedBackground.abilities.map((ab: Ability) => [ab, 1]));
    setAbilityBoosts(boosts);
  }
  }, [backgroundBoostMode, selectedBackground]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleScoreChange = (ability: keyof typeof scores, value: number) => {
    setScores((prev) => ({ ...prev, [ability]: value }));
  };

  const handleRoll = (ability: keyof typeof scores) => {
    const rolledValue = roll4d6DropLowest();
    setScores((prev) => ({ ...prev, [ability]: rolledValue }));
  };

const submitCharacterCreation = async () => {
  try {
    if (
      !characterName.trim() ||
      selectedClass === null ||
      selectedSpecies === null ||
      selectedBackground === null ||
      !scores ||
      selectedEquipment.length === 0 ||
      selectedSkills.length !== selectedClass.skillProfsNum ||
      languageChoices.length !== 2
    ) {
      alert("Please complete all steps before submitting.");
      return;
    }

    const finalAbilityScores = { ...scores };
    for (const [ability, boost] of Object.entries(abilityBoosts)) {
      const abilityKey = ability.toLowerCase() as keyof typeof scores;
      console.log(`Score BEFORE background boost: ${finalAbilityScores[abilityKey]}`);
      console.log(`Boosts: ${boost}`);
      finalAbilityScores[abilityKey] += boost;
      console.log(`Score AFTER background boost: ${finalAbilityScores[abilityKey]}`);
    }

    const data = {
      chosenName: characterName.trim(),
      chosenClassId: selectedClass.id,
      chosenSpeciesId: selectedSpecies.id,
      chosenBackgroundId: selectedBackground.id,
      abilityScores: finalAbilityScores,
      chosenEquipmentIds: selectedEquipment,
      skillProfs: selectedSkills,       
      knownLanguages: languageChoices, 
    };

    console.log("Submitting character data:", data);
    await createCharacter(data);
    alert("Character created successfully!");
    router.push("/");
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
          <button className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => router.push("/")}>
          Back to Home
          </button>
          {step === 0 && (
          <div>
            <h3 className="text-xl text-white">Choose Your Class:</h3>
            <h4 className="text--xl text-blue-500">Your Selected Class is: {selectedClass?.name}</h4>
            <ul>
              {classes?.map((classObj) => (
                <li key={classObj.id} className="mt-2">
                  <button className="text-white" onClick={() => {
                    setClass(classObj);
                    setSelectedSkills([]); // reset on class change
                  }}>{classObj.name}</button>
                </li>
              ))}
            </ul>

            {selectedClass && (
              <>
                <h5 className="mt-4 text-xl text-white">Choose {selectedClass.skillProfsNum} Skill Proficiencies</h5>
                <ul className="text-white">
                  {selectedClass.availableSkillProfs.map((skill) => (
                    <li key={skill}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => {
                            setSelectedSkills((prev) =>
                              prev.includes(skill)
                                ? prev.filter((s) => s !== skill)
                                : prev.length < selectedClass.skillProfsNum
                                ? [...prev, skill]
                                : prev
                            );
                          }}
                        />
                        {skill}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

          {step === 1 && (
            <div>
              <h3 className="text-xl text-white">Choose Your Species:</h3>
              <h4 className="text--xl text-blue-500">Your Selected Species is: {selectedSpecies?.name}</h4>
              <ul>
                {species?.map((speciesObj) => (
                  <li key={speciesObj.id} className="mt-2">
                    <button className="text-white" onClick={() => setSpecies(speciesObj)}>{speciesObj.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
          <div className="text-white">
          <div className="mt-4">
            <label className="block text-lg">Character Name:</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="text-black p-2 rounded w-full mt-1"
              placeholder="Enter character name"
            />
          </div>
            <h3 className="text-xl">Choose Your Background:</h3>
            <h4 className="text--xl text-blue-500">Selected Background: {selectedBackground?.name}</h4>
            <ul>
              {backgrounds?.map((bg) => (
                <li key={bg.id} className="mt-2">
                  <button className="text-white" onClick={() => {
                    setBackground(bg);
                    setBackgroundBoostMode(null);
                    setAbilityBoosts({});
                    setLanguageChoices([]);
                  }}>{bg.name}</button>
                </li>
              ))}
            </ul>

            {selectedBackground && (
              <div className="mt-4">
                <h4 className="text-lg">Boost Abilities:</h4>
                <p>Abilities available to boost: {selectedBackground.abilities.join(", ")}</p>

                {!backgroundBoostMode && (
                  <>
                    <button className="mr-2 mt-2 bg-blue-600 px-2 py-1 rounded" onClick={() => setBackgroundBoostMode("threeOnes")}>
                      +1 to each of the three
                    </button>
                    <button className="mt-2 bg-blue-600 px-2 py-1 rounded" onClick={() => setBackgroundBoostMode("twoAndOne")}>
                      +2 to one, +1 to another
                    </button>
                  </>
                )}

                {backgroundBoostMode === "threeOnes" && (
                  <div className="mt-2">
                    {selectedBackground.abilities.map((ab) => (
                      <p key={ab}>{ab}: +1</p>
                    ))}
                  </div>
                )}

                {backgroundBoostMode === "twoAndOne" && (
                <div className="mt-2">
                  <label className="block mb-2">+2 to:</label>
                  <select
                    className="text-black p-1 mb-2"
                    onChange={(e) => {
                      const two = e.target.value;
                      setAbilityBoosts((prev) => {
                        const updated = { ...prev };
                        if (two) updated[two] = 2;
                        // Remove any old +2 boosts from other abilities
                        for (const key of selectedBackground.abilities) {
                          if (key !== two && updated[key] === 2) delete updated[key];
                        }
                        return updated;
                      });
                    }}
                    value={Object.entries(abilityBoosts).find(([_, val]) => val === 2)?.[0] ?? ""}
                  >
                    <option value="">-- Select --</option>
                    {selectedBackground.abilities.map((ab) => (
                      <option key={ab} value={ab}>{ab}</option>
                    ))}
                  </select>

                  <label className="block mb-2">+1 to:</label>
                  <select
                    className="text-black p-1"
                    onChange={(e) => {
                      const one = e.target.value;
                      setAbilityBoosts((prev) => {
                        const updated = { ...prev };
                        if (one) updated[one] = 1;
                        // Remove any old +1 boosts from other abilities
                        for (const key of selectedBackground.abilities) {
                          if (key !== one && updated[key] === 1) delete updated[key];
                        }
                        return updated;
                      });
                    }}
                    value={Object.entries(abilityBoosts).find(([_, val]) => val === 1)?.[0] ?? ""}
                  >
                    <option value="">-- Select --</option>
                    {selectedBackground.abilities
                      .filter((ab) => ab !== Object.entries(abilityBoosts).find(([_, val]) => val === 2)?.[0]) // exclude +2 ability
                      .map((ab) => (
                        <option key={ab} value={ab}>{ab}</option>
                      ))}
                  </select>
                </div>
              )}
                              <h4 className="mt-4 text-lg">Choose 2 Languages:</h4>
                <ul>
                  {allLanguages.map((lang) => (
                    <li key={lang}>
                      <label>
                        <input
                          type="checkbox"
                          checked={languageChoices.includes(lang)}
                          disabled={!languageChoices.includes(lang) && languageChoices.length >= 2}
                          onChange={() => {
                            setLanguageChoices((prev) =>
                              prev.includes(lang)
                                ? prev.filter((l) => l !== lang)
                                : [...prev, lang]
                            );
                          }}
                        />
                        {lang}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

