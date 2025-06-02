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
import React from "react";
import router from "next/router";
<link rel="stylesheet" href="./styles/global.css" />
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
    onSuccess: (data) => {
    const character = data as unknown as { id: number };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `character-${character.id}.json`;
    a.click();
  }
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
      <main className="min-h-screen text-black">
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
        <main className="bg-[#20222c]">
        <main className="bg-[#20222c] text-white m-auto max-w-[1000px] h-[567px]">
        <SignedOut>
          <div>
            <h1 className="text-[38px] leading-[52px] pt-[34px] pb-[10px] font-bold">Інтерактивний лист для персонажа D&D</h1>
            <p className="text-[20px] leading-[27px] mb-[34px] text-[#bdc6db]">Щоб продовжити, увійдіть до свого аккаунту або створіть новий.</p>
            <ul className="mb-[36px]">
              <li className="items-start flex mb-[9.28px]">
              <svg className="h-[24px] mr-[10px] min-w-[24px] w-[24px]" width="30" height="30" viewBox="0 0 33 33" stroke="white" fill="none">
                <path d="M16.4997 1.99976L28.4997 9.95628M16.4997 1.99976L4.49969 9.95628M16.4997 1.99976V9.69541M28.4997 9.95628L16.4997 9.69541M28.4997 9.95628L23.9345 21.1737M28.4997 9.95628V22.3476M28.4997 22.3476L16.4997 30.4345M28.4997 22.3476L23.9345 21.1737M16.4997 30.4345L4.49969 22.3476M16.4997 30.4345L9.06491 21.1737M16.4997 30.4345L23.9345 21.1737M4.49969 22.3476V9.95628M4.49969 22.3476L9.06491 21.1737M4.49969 9.95628L16.4997 9.69541M4.49969 9.95628L9.06491 21.1737M16.4997 9.69541L9.06491 21.1737M16.4997 9.69541L23.9345 21.1737M9.06491 21.1737H23.9345" stroke="inherit"></path>
              </svg>
              Синхронізація між кількома пристроями
              </li>
              <li className="items-start flex mb-[9.28px]">
              <svg className="h-[24px] mr-[10px] min-w-[24px] w-[24px]" width="30" height="30" viewBox="0 0 33 33" stroke="white" fill="none">
                <path d="M16.4997 1.99976L28.4997 9.95628M16.4997 1.99976L4.49969 9.95628M16.4997 1.99976V9.69541M28.4997 9.95628L16.4997 9.69541M28.4997 9.95628L23.9345 21.1737M28.4997 9.95628V22.3476M28.4997 22.3476L16.4997 30.4345M28.4997 22.3476L23.9345 21.1737M16.4997 30.4345L4.49969 22.3476M16.4997 30.4345L9.06491 21.1737M16.4997 30.4345L23.9345 21.1737M4.49969 22.3476V9.95628M4.49969 22.3476L9.06491 21.1737M4.49969 9.95628L16.4997 9.69541M4.49969 9.95628L9.06491 21.1737M16.4997 9.69541L9.06491 21.1737M16.4997 9.69541L23.9345 21.1737M9.06491 21.1737H23.9345" stroke="inherit"></path>
              </svg>
              Зручне відстеження здоров&apos;я, досвіду та монет
              </li>
              <li className="items-start flex mb-[9.28px]">
              <svg className="h-[24px] mr-[10px] min-w-[24px] w-[24px]" width="30" height="30" viewBox="0 0 33 33" stroke="white" fill="none">
                <path d="M16.4997 1.99976L28.4997 9.95628M16.4997 1.99976L4.49969 9.95628M16.4997 1.99976V9.69541M28.4997 9.95628L16.4997 9.69541M28.4997 9.95628L23.9345 21.1737M28.4997 9.95628V22.3476M28.4997 22.3476L16.4997 30.4345M28.4997 22.3476L23.9345 21.1737M16.4997 30.4345L4.49969 22.3476M16.4997 30.4345L9.06491 21.1737M16.4997 30.4345L23.9345 21.1737M4.49969 22.3476V9.95628M4.49969 22.3476L9.06491 21.1737M4.49969 9.95628L16.4997 9.69541M4.49969 9.95628L9.06491 21.1737M16.4997 9.69541L9.06491 21.1737M16.4997 9.69541L23.9345 21.1737M9.06491 21.1737H23.9345" stroke="inherit"></path>
              </svg>
              Безпечне сховище для ваших персонажів
              </li>
              <li className="items-start flex mb-[9.28px]">
              <svg className="h-[24px] mr-[10px] min-w-[24px] w-[24px]" width="30" height="30" viewBox="0 0 33 33" stroke="white" fill="none">
                <path d="M16.4997 1.99976L28.4997 9.95628M16.4997 1.99976L4.49969 9.95628M16.4997 1.99976V9.69541M28.4997 9.95628L16.4997 9.69541M28.4997 9.95628L23.9345 21.1737M28.4997 9.95628V22.3476M28.4997 22.3476L16.4997 30.4345M28.4997 22.3476L23.9345 21.1737M16.4997 30.4345L4.49969 22.3476M16.4997 30.4345L9.06491 21.1737M16.4997 30.4345L23.9345 21.1737M4.49969 22.3476V9.95628M4.49969 22.3476L9.06491 21.1737M4.49969 9.95628L16.4997 9.69541M4.49969 9.95628L9.06491 21.1737M16.4997 9.69541L9.06491 21.1737M16.4997 9.69541L23.9345 21.1737M9.06491 21.1737H23.9345" stroke="inherit"></path>
              </svg>
              Декілька популярних перекладів на вибір
              </li>
              <li className="items-start flex mb-[9.28px]">
              <svg className="h-[24px] mr-[10px] min-w-[24px] w-[24px]" width="30" height="30" viewBox="0 0 33 33" stroke="white" fill="none">
                <path d="M16.4997 1.99976L28.4997 9.95628M16.4997 1.99976L4.49969 9.95628M16.4997 1.99976V9.69541M28.4997 9.95628L16.4997 9.69541M28.4997 9.95628L23.9345 21.1737M28.4997 9.95628V22.3476M28.4997 22.3476L16.4997 30.4345M28.4997 22.3476L23.9345 21.1737M16.4997 30.4345L4.49969 22.3476M16.4997 30.4345L9.06491 21.1737M16.4997 30.4345L23.9345 21.1737M4.49969 22.3476V9.95628M4.49969 22.3476L9.06491 21.1737M4.49969 9.95628L16.4997 9.69541M4.49969 9.95628L9.06491 21.1737M16.4997 9.69541L9.06491 21.1737M16.4997 9.69541L23.9345 21.1737M9.06491 21.1737H23.9345" stroke="inherit"></path>
              </svg>
              Автоматичний розрахунок характеристик
              </li>
            </ul>
            <div className="justify-start pb-[150px] p-0 static">
            <SignInButton>
            <button className="items-center dark:bg-blue-900 border-1 border-solid border-blue-200 rounded-xs cursor-pointer flex text-xs font-bold h-[34px] justify-center tracking-normal max-w-[266px] w-[100%]  hover:bg-[#042470] hover:border-blue-100 hover:transition duration-400 ease-in-out">Увійти</button>
            </SignInButton>
            </div>
          </div>
          </SignedOut>
          <SignedIn>
            <div className="pt-[15px] w-[1000px]">
              <h2 className="flex items-center space-x-3 pt-[10px] pb-[20px]">Your Characters: 
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="block hover:bg-[#3a3e50] ml-[20px] px-[10px] py-[10px] cursor-pointer border border-gray-700 rounded"
              >
                Import
              </button>
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </h2>
              {isLoading && <p>Loading characters...</p>}
              {isError && <p>Failed to load characters.</p>}
              {characters?.length ? (
                <ul className="space-y-6 flex flex-wrap gap-4">
                {characters.map((character: Character) => (
                      <li
                      key={character.id}
                      onClick={() => router.push(`/interactivesheet?charId=${character.id}`)}
                      className="relative bg-[#222533] border border-[#333a50] hover:border-[#3f5ce2] 
                             rounded-lg p-4 w-[300px] text-white space-y-2 cursor-pointer"
                      >
                      <div className="font-bold">{character.name}</div>
                      <div>
                        Species: {character.species?.name ?? "Unknown"} <br />
                        Background: {character.background?.name ?? "Unknown"} <br />
                        Classes:{" "}
                        {character.characterClasses
                          ?.map((cc) => cc?.class.name ?? "Unknown")
                          .join(", ") ?? "None"}
                      </div>
                      <div className="text-green-400 text-sm">💚{character.currentHitPoints} / {character.maxHitPoints} HP</div>
                      <div
                        className="absolute top-2 right-2 group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="text-gray-400 hover:text-white text-xl">⋮</button>
                        <div className="hidden group-hover:block absolute right-0 w-30 bg-[#2c2e3c] border border-gray-700 rounded shadow-lg z-10">
                          <div className="flex flex-col items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cloneCharacter.mutate({ charId: character.id });
                            }}
                            className="block px-4 py-2 hover:bg-[#3a3e50] cursor-pointer"
                          >
                            Clone
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={handleFileUpload}
                         />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportCharacter.mutate({ charId: character.id });
                            }}
                            className="block px-4 py-2 hover:bg-[#3a3e50] cursor-pointer"
                          >
                            Export
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCharacter.mutate({ id: character.id });
                            }}
                            className="block px-4 py-2 text-red-400 hover:bg-[#3a3e50] cursor-pointer"
                          >
                            Delete
                          </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                            ))}
              <div className="relative bg-[#222533] border border-[#333a50] hover:border-[#3f5ce2] rounded-lg w-[300px] text-white space-y-2 cursor-pointer">
              <Link href="creation" className="flex items-center justify-center text-[50px]">
                    +
                </Link>
              </div>
              </ul>
              ) : (
                <>
                <div className="relative bg-[#222533] border border-[#333a50] hover:border-[#3f5ce2] rounded-lg w-[300px] text-white space-y-2 cursor-pointer">
                      <Link href="creation" className="flex items-center justify-center text-[50px]">
                        +
                      </Link>
                </div></>
              )}
            </div>
            </SignedIn>
        </main>
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
      </main>
    </>
  );
}
