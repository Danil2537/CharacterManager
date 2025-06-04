import { useEffect, useState } from "react";

const diceTypes = [2, 4, 6, 8, 10, 12, 20, 100];

export const triggerAbilityCheck = (modifier: number) => {
  window.dispatchEvent(new CustomEvent("rollAbilityCheck", { detail: modifier }));
};

export const triggerCustomDiceRoll = (num: number, faces: number) => {
  window.dispatchEvent(
    new CustomEvent("rollCustomDice", { detail: { num, faces } })
  );
};

export function DiceRoller() {
  const [selectedDice, setSelectedDice] = useState<number[]>([]);
  const [rollResults, setRollResults] = useState<number[]>([]);
  const [rolledDice, setRolledDice] = useState<(number | string)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);

  const rollAllDice = () => {
    const results = selectedDice.map((sides) =>
      Math.floor(Math.random() * sides) + 1
    );
    setRollResults(results);
    setRolledDice(selectedDice);
    setSelectedDice([]);
    setResultVisible(true);
    setMenuOpen(false);
  };

  const rollCustomDice = (num: number, faces: number) => {
    const rolls = Array.from({ length: num }, () => Math.floor(Math.random() * faces) + 1);
    setRollResults(rolls);
    setRolledDice([`${num}к${faces}`]);
    setResultVisible(true);
  };

  useEffect(() => {
    const handleAbilityCheck = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      const modifier = customEvent.detail;
      const roll = Math.floor(Math.random() * 20) + 1;
      const total = roll + modifier;

      setRollResults([roll, modifier, total]);
      setRolledDice(["1к20", "Модифікатор", "Сума"]);
      setResultVisible(true);
    };

    const handleCustomDice = (e: Event) => {
      const customEvent = e as CustomEvent<{ num: number; faces: number }>;
      rollCustomDice(customEvent.detail.num, customEvent.detail.faces);
    };

    window.addEventListener("rollAbilityCheck", handleAbilityCheck);
    window.addEventListener("rollCustomDice", handleCustomDice);

    return () => {
      window.removeEventListener("rollAbilityCheck", handleAbilityCheck);
      window.removeEventListener("rollCustomDice", handleCustomDice);
    };
  }, []);

  return (
    <div className="relative z-50">
      {resultVisible && (
        <div className="fixed bottom-5 left-5 bg-gray-900 text-white p-4 rounded-lg shadow-xl w-64">
          <div className="flex justify-between items-center mb-2">
            <div className="text-purple-400 text-xs uppercase">БРОСОК</div>
            <button
              className="text-gray-400 hover:text-white text-xs cursor-pointer"
              onClick={() => {
                setResultVisible(false);
                setRollResults([]);
                setRolledDice([]);
              }}
            >
              ✕
            </button>
          </div>

          <div className="text-sm text-gray-300 mb-1 space-y-1">
            {rolledDice.length === 1 && typeof rolledDice[0] === "string" ? (
              <>
                <div className="text-purple-300">{rolledDice[0]}</div>
                {rollResults.map((r, i) => (
                  <div key={i} className="ml-2">• <span className="text-white">{r}</span></div>
                ))}
              </>
            ) : (
              rollResults.map((r, i) => (
                <div key={i}>
                  {typeof rolledDice[i] === "number"
                    ? `1к${rolledDice[i]}`
                    : rolledDice[i] ?? `#${i + 1}`}:
                  <span className="text-white ml-1">{r}</span>
                </div>
              ))
            )}
          </div>

          <div className="text-3xl font-bold text-right text-white mt-2">
            = {rollResults.reduce((a, b) => a + b, 0)}
          </div>
        </div>
      )}

      <div className="fixed bottom-28 right-30 z-50">
        <button
          className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl hover:bg-gray-800 transition cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "×" : "🎲"}
        </button>

        {menuOpen && (
          <div className="absolute inset-0 w-[250px] h-[250px] translate-x-[-100px] translate-y-[-100px] pointer-events-none">
            {diceTypes.map((sides, index) => {
              const angle = (index / diceTypes.length) * 2 * Math.PI;
              const radius = 100;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <button
                  key={sides}
                  className="w-10 h-10 rounded-full bg-white text-black absolute flex items-center justify-center text-xs shadow-md pointer-events-auto"
                  style={{
                    left: `${125 + x - 20}px`,
                    top: `${125 - y - 20}px`,
                  }}
                  onClick={() => setSelectedDice((prev) => [...prev, sides])}
                >
                  1к{sides}
                </button>
              );
            })}

            {selectedDice.length > 0 && (
              <button
                className="absolute left-[85px] top-[160px] px-3 py-2 bg-purple-600 text-white text-xs rounded-lg shadow-md hover:bg-purple-700 pointer-events-auto"
                onClick={rollAllDice}
              >
                Бросить {selectedDice.length}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}