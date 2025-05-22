import Head from "next/head";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { api, type RouterOutputs } from "../utils/api";
import Link from "next/link";
import { useRef } from "react";
import { useState, createContext, useContext, type ReactNode, useEffect } from "react";
import { Language, type Skill } from "@prisma/client";
import { useRouter } from "next/navigation";
// Define the expected type for characters
type Character = RouterOutputs["profile"]["getUserCharacters"][number];

export default function Home() {
  const { data: characters, isLoading, isError, refetch } =
    api.profile.getUserCharacters.useQuery(undefined, {
      enabled: typeof window !== "undefined",
    });

  const cloneCharacter = api.profile.cloneCharacter.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteCharacter = api.profile.deleteCharacter.useMutation({
    onSuccess: () => refetch(),
  });

  const exportCharacter = api.profile.exportCharacter.useMutation({
    onSuccess: (data: { id: any; }) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `character-${data.id}.json`;
      a.click();
    },
  });

  const importCharacter = api.profile.importCharacter.useMutation({
    onSuccess: () => refetch(),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const data = JSON.parse(content);

    importCharacter.mutate({characterData: data});
  };

  return (
    <>
      <Head>
        <title>Character Manager</title>
        <meta name="description" content="Manage your D&D characters" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
            <div className="mt-4">
              <h2 className="text-2xl font-bold">Your Characters:</h2>
              {isLoading && <p>Loading characters...</p>}
              {isError && <p>Failed to load characters.</p>}
              {characters?.length ? (
                <ul className="space-y-6">
                  {characters.map((character: Character) => (
                    <li
                      key={character.id}
                      className="border border-white rounded p-4"
                    >
                      <div className="font-bold text-xl">{character.name}</div>
                      <div>
                        Species: {character.species?.name ?? "Unknown"} <br />
                        Background: {character.background?.name ?? "Unknown"} <br />
                        Subclass: {character.subclass?.name ?? "None"} <br />
                        Classes:{" "}
                        {character.characterClasses
                          ?.map((cc) => cc.class?.name ?? "Unknown")
                          .join(", ") ?? "None"}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => cloneCharacter.mutate({ charId: character.id })}
                          className="bg-yellow-500 px-3 py-1 rounded"
                        >
                          Clone
                        </button>
                        <button
                          onClick={() => deleteCharacter.mutate({ id: character.id })}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => exportCharacter.mutate({ charId: character.id })}
                          className="bg-blue-600 px-3 py-1 rounded"
                        >
                          Export
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No characters found.</p>
              )}

              <div className="mt-6 flex flex-col items-center">
                <button
                  className="bg-green-600 px-4 py-2 rounded mb-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import Character
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </SignedIn>

          <Link href="creation" className="bg-white text-black px-4 py-2 rounded">
            Create a Character
          </Link>
        </div>
      </main>
    </>
  );
}
