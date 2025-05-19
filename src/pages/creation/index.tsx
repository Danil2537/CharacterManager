"use client"
import Head from "next/head";
import Link from "next/link";
import { useState, createContext, useContext, type ReactNode } from "react";
import { api, type RouterOutputs } from "../../utils/api";
// Character Creation Context
type CharacterCreationContextType = {
  selectedClass: number | null;
  selectedSpecies: number | null;
  selectedBackground: number | null;
  abilityScores: number[] | null;
  selectedEquipment: number[];
  setClass: (classObj: number) => void;
  setSpecies: (species: number) => void;
  setBackground: (background: number) => void;
  setAbilityScores: (scores: number[]) => void;
  setEquipment: (equipment: number[]) => void;
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
  const { selectedClass, setClass, selectedSpecies, setSpecies, selectedBackground, setBackground } = useCharacterCreation();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

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
            <p>Species Selection. Work in progress...</p>
          )}

          {step === 2 && (
            <p>Background Selection. Work in progress...</p>
          )}
          {step === 3 && (
            <p>Ability scores determination. Work in progress...</p>
          )}
          {step === 4 && (
            <p>Starting Equipment Selection. Work in progress...</p>
          )}

          <div className="flex gap-4 mt-8">
            <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 text-white bg-gray-600 rounded">Previous</button>
            <button onClick={nextStep} className="px-4 py-2 text-white bg-blue-600 rounded">Next</button>
          </div>
        </div>
      </main>
    </>
  );
}

