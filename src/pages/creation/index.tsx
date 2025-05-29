"use client"
import Head from "next/head";
import { useState, createContext, useContext, type ReactNode, useEffect } from "react";
import { api, type RouterOutputs } from "../../utils/api";
import { Ability, Language, type Skill } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
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
const [openClassDescription, setOpenClassDescription] = useState<number | null>(null);
const [openBackgroundDescription, setOpenBackgroundDescription] = useState<null | number>(null);
const [openSpeciesDescription, setOpenSpeciesDescription] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>Character Creation</title>
      </Head>
      <main className="min-h-screen text-black bg-[#20222c]">
      <header className="dark:bg-gray-800 dark:text-white shadow-md">
          <nav className="justify-start flex m-auto items-center ml-30 pt-3 mr-30 pb-2">
            <Link className="mr-10" href="/">
              <img src="/favicon.ico" alt="" />
            </Link>
            <Link className="flex items-center p-2 mr-10 border-1 border-solid rounded-lg shadow-md hover:bg-white hover:text-black hover:transition duration-400 ease-in-out" href="/">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 2.75C12.22 2.75 12.41 2.85 12.55 3C12.67 3.13 12.75 3.31 12.75 3.5C12.75 3.91 12.41 4.25 12 4.25C11.59 4.25 11.25 3.91 11.25 3.5C11.25 3.31 11.33 3.13 11.45 3C11.59 2.85 11.78 2.75 12 2.75ZM19 19H5V5H19V19ZM12 6C10.35 6 9 7.35 9 9C9 10.65 10.35 12 12 12C13.65 12 15 10.65 15 9C15 7.35 13.65 6 12 6ZM6 16.47V18H18V16.47C18 13.97 14.03 12.89 12 12.89C9.97 12.89 6 13.96 6 16.47Z" fill="inherit"></path>
              </svg>
              <span className="pl-2">Мої персонажі</span>
            </Link>
              <SignedOut>
              <SignInButton>
              <button className="flex items-center ml-auto cursor-pointer">
              <svg width="48" height="48" viewBox="0 0 48 48">
              <path d="M11.1 35.25q3.15-2.2 6.25-3.375Q20.45 30.7 24 30.7q3.55 0 6.675 1.175t6.275 3.375q2.2-2.7 3.125-5.45Q41 27.05 41 24q0-7.25-4.875-12.125T24 7q-7.25 0-12.125 4.875T7 24q0 3.05.95 5.8t3.15 5.45ZM24 25.5q-2.9 0-4.875-1.975T17.15 18.65q0-2.9 1.975-4.875T24 11.8q2.9 0 4.875 1.975t1.975 4.875q0 2.9-1.975 4.875T24 25.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.775t4.3-6.35q2.725-2.725 6.375-4.3Q19.9 4 24 4q4.15 0 7.775 1.575t6.35 4.3q2.725 2.725 4.3 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.3 6.375-2.725 2.725-6.35 4.3Q28.15 44 24 44Zm0-3q2.75 0 5.375-.8t5.175-2.8q-2.55-1.8-5.2-2.75-2.65-.95-5.35-.95-2.7 0-5.35.95-2.65.95-5.2 2.75 2.55 2 5.175 2.8Q21.25 41 24 41Zm0-18.5q1.7 0 2.775-1.075t1.075-2.775q0-1.7-1.075-2.775T24 14.8q-1.7 0-2.775 1.075T20.15 18.65q0 1.7 1.075 2.775T24 22.5Zm0-3.85Zm0 18.7Z"  fill="white"></path>
              </svg>
              </button>
              </SignInButton>
              </SignedOut>
              <SignedIn> 
                <div className="flex items-center ml-auto cursor-pointer w-[30px] h-[30px] override-clerk-avatar">
                <UserButton />
                </div>
              </SignedIn>
            
          </nav>
        </header>
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h2 className="text-2xl font-bold text-white border border-gray-700 rounded px-5 py-5 bg-[#121222]">Створення персонажа (Шаг {step + 1})</h2>

          {step === 0 && (
          <div className="block px-[30px] py-[30px] border border-gray-700 rounded w-[1000px] bg-[#121222]">
            <h3 className="text-xl text-white pb-[10px] items-center justify-center flex">Оберіть свій класс:</h3>
            <h4 className="text--xl text-blue-500 items-center justify-center flex">Ваш обраний клас це: {selectedClass?.name}</h4>
            <ul>
              {classes?.map((classObj) => (
                <li key={classObj.id} className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      className={`text-white p-5 rounded-md border text-sm font-medium flex items-center justify-center mt-[10px] w-[300px] hover:transition duration-400 ease-in-out cursor-pointer
                        ${
                          selectedClass?.name === classObj.name
                            ? "bg-blue-600 text-white border-blue-400"
                            : "bg-[#1a1a2e] text-white border-gray-600 hover:border-blue-400"
                        }`}
                      onClick={() => {
                        setClass(classObj);
                        setSelectedSkills([]);
                      }}
                    >
                      {classObj.name}
                    </button>

                    <button
                      onClick={() =>
                        setOpenClassDescription((prev) =>
                          prev === classObj.id ? null : classObj.id
                        )
                      }
                      className="mt-[10px] text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      ℹ️
                    </button>
                  </div>

                  {openClassDescription === classObj.id && (
                    <div className="mt-2 w-[800px] p-3 text-sm text-gray-300 bg-[#22223b] rounded-md border border-gray-600">
                      {classObj.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {selectedClass && (
              <>
              <h5 className="mt-4 text-xl text-white items-center justify-center flex pb-[15px] pt-[15px]">Оберіть {selectedClass.skillProfsNum} Навички:</h5>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {selectedClass.availableSkillProfs.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setSelectedSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((s) => s !== skill)
                            : prev.length < selectedClass.skillProfsNum
                            ? [...prev, skill]
                            : prev
                        );
                      }}
                      className={`p-4 rounded-md border transition duration-200 text-sm font-medium items-center justify-center flex cursor-pointer
                        ${isSelected ? "bg-blue-600 text-white border-blue-400" : "bg-[#1a1a2e] text-white border-gray-600 hover:border-blue-400"}
                      `}
                    >
                      {skill}
                    </button>
                  );
                })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="block px-[30px] py-[30px] border border-gray-700 rounded w-[1000px] h-[240px] flex flex-col items-center justify-center bg-[#121222]">
            <h3 className="text-xl text-white pb-[10px]">Оберіть свій вид:</h3>
            <h4 className="text-xl text-blue-500 pb-[30px]">Ваш обраний вид: {selectedSpecies?.name}</h4>
    
            <ul className="flex flex-col items-center space-y-4">
              {species?.map((speciesObj) => (
                <li key={speciesObj.id} className="flex flex-col items-center w-[300px]">
                  <div className="flex w-full relative">
                    <button
                      className={`text-white p-4 rounded-md border text-sm font-medium w-full hover:transition duration-300 ease-in-out cursor-pointer
                        ${selectedSpecies?.id === speciesObj.id
                          ? "bg-blue-600 border-blue-400"
                          : "bg-[#1a1a2e] border-gray-600 hover:border-blue-400"}
                      `}
                      onClick={() => setSpecies(speciesObj)}
                    >
                      {speciesObj.name}
                    </button>

                    <button
                      onClick={() =>
                        setOpenSpeciesDescription((prev) =>
                          prev === speciesObj.id ? null : speciesObj.id
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-lg hover:text-blue-400 cursor-pointer"
                    >
                      ℹ️
                    </button>
                  </div>

                  {openSpeciesDescription === speciesObj.id && (
                    <div className="mt-2 w-[400px] p-3 text-sm text-gray-300 bg-[#22223b] rounded-md border border-gray-600">
                      {speciesObj.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className="text-white px-[30px] py-[30px] border border-gray-700 rounded w-[1000px] flex flex-col items-center justify-center bg-[#121222]">
    
            <div className="w-full max-w-[500px] mb-6">
              <label className="block text-lg mb-2 flex flex-col items-center justify-center">Ім$aposя персонажа:</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#1a1a2e] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введіть ім&aposя"
                />
            </div>

            <h3 className="text-xl mb-2">Оберіть своє походження:</h3>
            <h4 className="text-xl text-blue-500 mb-4">
              Обране походження: {selectedBackground?.name}
            </h4>

            <ul className="flex flex-col items-center space-y-4 mb-6">
              {backgrounds?.map((bg) => (
            <li key={bg.id} className="flex flex-col items-center w-[300px]">
            <div className="flex w-full relative">
            <button
              className={`text-white p-4 rounded-md border text-sm font-medium w-full hover:transition duration-300 ease-in-out cursor-pointer
                ${selectedBackground?.id === bg.id
                  ? "bg-blue-600 border-blue-400"
                  : "bg-[#1a1a2e] border-gray-600 hover:border-blue-400"}
              `}
              onClick={() => {
                setBackground(bg);
                setBackgroundBoostMode(null);
                setAbilityBoosts({});
                setLanguageChoices([]);
              }}
            >
              {bg.name}
            </button>

            <button
              onClick={() =>
                setOpenBackgroundDescription((prev) => (prev === bg.id ? null : bg.id))
              }
              className="mt-[1px] ml-[5px] text-white hover:text-blue-400 transition cursor-pointer"
            >
              ℹ️
            </button>
          </div>

          {openBackgroundDescription === bg.id && (
            <div className="mt-2 w-[800px] p-3 text-sm text-gray-300 bg-[#22223b] rounded-md border border-gray-600">
              {bg.description}
            </div>
          )}
        </li>
      ))}
    </ul>

    {selectedBackground && (
      <div className="w-full max-w-[600px]">
        <h4 className="text-lg mb-2 flex flex-col items-center justify-center">Покращення характеристик:</h4>
        <p className="mb-4 flex flex-col items-center justify-center">
          Доступні характеристики:{" "}
          <span className="text-blue-400">{selectedBackground.abilities.join(", ")}</span>
        </p>

        {!backgroundBoostMode && (
          <>
            <button
              className="ml-[100px] mr-2 mt-2 bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={() => setBackgroundBoostMode("threeOnes")}
            >
              +1 до кожної з трьох
            </button>
            <button
              className="mt-2 bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={() => setBackgroundBoostMode("twoAndOne")}
            >
              +2 до однієї, +1 до іншої
            </button>
          </>
        )}

        {backgroundBoostMode === "threeOnes" && (
          <div className="mt-4 space-y-1 flex flex-col items-center justify-center">
            {selectedBackground.abilities.map((ab) => (
              <p key={ab}>
                {ab}: <span className="text-green-400 font-medium">+1</span>
              </p>
            ))}
          </div>
        )}

        {backgroundBoostMode === "twoAndOne" && (
          <div className="mt-4">
            <label className="block mb-2 flex flex-col items-center justify-center pb-[10px]">+2 до:</label>
            <select
              className="text-white p-2 rounded w-full bg-[#1a1a2e] pb-[10px]"
              onChange={(e) => {
                const two = e.target.value;
                setAbilityBoosts((prev) => {
                  const updated = { ...prev };
                  if (two) updated[two] = 2;
                  for (const key of selectedBackground.abilities) {
                    if (key !== two && updated[key] === 2) delete updated[key];
                  }
                  return updated;
                });
              }}
              value={Object.entries(abilityBoosts).find(([_, val]) => val === 2)?.[0] ?? ""}
            >
              <option value="">-- Виберіть --</option>
              {selectedBackground.abilities.map((ab) => (
                <option key={ab} value={ab}>{ab}</option>
              ))}
            </select>

            <label className="block mb-2 flex flex-col items-center justify-center pb-[10px] pt-[10px]">+1 до:</label>
            <select
              className="text-white p-2 rounded w-full bg-[#1a1a2e]"
              onChange={(e) => {
                const one = e.target.value;
                setAbilityBoosts((prev) => {
                  const updated = { ...prev };
                  if (one) updated[one] = 1;
                  for (const key of selectedBackground.abilities) {
                    if (key !== one && updated[key] === 1) delete updated[key];
                  }
                  return updated;
                });
              }}
              value={Object.entries(abilityBoosts).find(([_, val]) => val === 1)?.[0] ?? ""}
            >
              <option value="">-- Виберіть --</option>
              {selectedBackground.abilities
                .filter((ab) => ab !== Object.entries(abilityBoosts).find(([_, val]) => val === 2)?.[0])
                .map((ab) => (
                  <option key={ab} value={ab}>{ab}</option>
                ))}
            </select>
          </div>
        )}
        <h4 className="mt-6 text-lg">Оберіть 2 мови:</h4>
        <div className="flex flex-wrap gap-3 mt-3">
          {allLanguages.map((lang) => {
            const selected = languageChoices.includes(lang);
            const disabled = !selected && languageChoices.length >= 2;
            return (
              <button
                key={lang}
                disabled={disabled}
                onClick={() => {
                  setLanguageChoices((prev) =>
                    selected ? prev.filter((l) => l !== lang) : [...prev, lang]
                  );
                }}
                className={`p-4 rounded-md border transition duration-200 text-sm font-medium items-center justify-center flex cursor-pointer
                  ${selected ? "bg-blue-600 text-white border-blue-400" : "bg-[#1a1a2e] text-white border-gray-600 hover:border-blue-400"}
                `}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </div>
)}
      {step === 3 && (
      <div className="flex flex-col items-center gap-6 text-white p-6 border border-gray-700 rounded w-[1000px] bg-[#121222]">
      <h2 className="text-2xl font-bold text-blue-500">Оберіть свій рівень характеристик</h2>
      <p className="text-lg text-gray-300 text-center">
        Введіть значення вручну, використовуйте стандартний масив або кидайте випадковим чином.
      </p>

      <div className="grid grid-cols-3 gap-6 w-full mt-4">
        {Object.keys(scores).map((ability) => (
          <div key={ability} className="flex flex-col items-center bg-[#1a1a2e] p-4 rounded-lg border border-gray-600">
            <label className="font-semibold text-lg text-white mb-2">
              {ability.charAt(0).toUpperCase() + ability.slice(1)}
            </label>

            <input
              type="number"
              value={scores[ability as keyof typeof scores]}
              onChange={(e) => handleScoreChange(ability as keyof typeof scores, Number(e.target.value))}
              className="w-20 p-2 text-white rounded text-center font-bold text-lg"
              min={1}
             max={20}
            />

            <button
              onClick={() => handleRoll(ability as keyof typeof scores)}
              className="mt-3 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Roll 🎲
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 w-full text-center">
        <p className="text-lg font-semibold text-white mb-2 underline">Поточні показники</p>
        <div className="flex justify-center gap-6 flex-wrap">
          {Object.entries(scores).map(([ability, value]) => (
            <div
              key={ability}
              className="bg-[#1a1a2e] px-4 py-2 rounded border border-gray-600 text-white"
            >
              {ability.charAt(0).toUpperCase() + ability.slice(1)}: <span className="text-blue-400 font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
    {step === 4 && (
    <div className="flex flex-col items-center gap-6 text-white p-6 border border-gray-700 rounded w-[1000px] bg-[#121222]">
    <h3 className="text-2xl font-bold text-blue-500">Виберіть своє обладнання</h3>

      <ul className="grid grid-cols-2 gap-4 w-full">
        {availableEquipment.map((item) => (
          <li
            key={item.id}
            className={`border rounded-md p-4 text-center font-medium cursor-pointer transition duration-200
            ${selectedEquipment.includes(item.id)
              ? "bg-blue-600 border-blue-400 text-white"
              : "bg-[#1a1a2e] border-gray-600 hover:border-blue-400 hover:bg-[#1f1f30]"}`}
            onClick={() => handleEquipmentToggle(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )}

    <div className="flex gap-4 mt-6 justify-center">
    <button
      onClick={prevStep}
      disabled={step === 0}
      className="px-5 py-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition disabled:opacity-50 cursor-pointer"
    >
      Попередня сторінка
    </button>

    {step === 4 ? (
      <button
        onClick={submitCharacterCreation}
        className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-500 transition cursor-pointer"
      >
       Завершити створення
      </button>
    ) : (
      <button
        onClick={nextStep}
        className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer"
      >
        Наступна сторінка
      </button>
    )}
    </div>
        </div>
        <footer className="bg-[#020022] relative z-100">
          <div className="flex mr-[20px] pt-[40px] pb-[80px] ml-[100px] m-auto text-white">
            <div className="flex flex-wrap items-center max-w[320px] flex-col items-start justify-start ml-0 mr-[60px] mt-0 mb-0 w-auto">
            <p className="text-left text-[12px] font-bold leading-[16px] tracking-[1px] mb-[4px] uppercase w-[100%] text-[#a3a3a3]">Рубрикатор</p>
            <Link className="text-[14px] leading-[30px] hover: transition opacity .1s hover:text-[#878787]" href="/">Головна</Link>
            <Link className="text-[14px] leading-[30px] hover: transition opacity .1s hover:text-[#878787]" href="/">Лист персонажа</Link>
            </div>
            <div className="flex flex-wrap items-center max-w[320px] flex-col items-start justify-start ml-0 mr-[60px] mt-0 mb-0 w-auto">
              <p className="text-left text-[12px] font-bold leading-[16px] tracking-[1px] mb-[4px] uppercase w-[100%] text-[#a3a3a3]">Соціальні мережі</p>
              <Link className="text-[14px] leading-[30px] hover: transition opacity .1s hover:text-[#878787]" href="#">Telegram</Link>
              <Link className="text-[14px] leading-[30px] hover: transition opacity .1s hover:text-[#878787]" href="#">Discord</Link>
              <Link className="text-[14px] leading-[30px] hover: transition opacity .1s hover:text-[#878787]" href="#">Instagram</Link>
            </div>
            <div className="flex flex-wrap items-center max-w[320px] flex-col items-start justify-start ml-0 mr-[60px] mt-0 mb-0 w-auto">
              <p className="text-left text-[12px] font-bold leading-[16px] tracking-[1px] mb-[4px] uppercase w-[100%] text-[#a3a3a3]">Підтримати</p>
              <Link className="text-[14px] text-[#f15f2c] leading-[25px] hover: transition opacity .1s hover:text-[#878787]" href="#">DonatePay</Link>
            </div>
          </div>
          <div className="flex bg-[#1e1d3b] p-[11px]">
            <span className="flex-row align-left ml-[80px]">
              <span className="text-[#bfbfbf] text-[14px]">
                ©
                2025
                Character Manager
              </span>
            </span>
          </div>
        </footer>
        </main>
    </>
  );
}

