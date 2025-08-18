import React from 'react';

const NearHundredPractice: React.FC = () => {
  return (
    <div className="flashcard">
      {/* Near Hundred practice UI */}
    </div>
  );
};

export function makeNearHundredQuestion(span = 10) {
  const base = 100;
  const a = base - Math.floor(Math.random() * (span) + 1);
  const b = base - Math.floor(Math.random() * (span) + 1);
  const left = base - ((base - a) + (base - b));
  const right = (base - a) * (base - b);
  const rightStr = String(right).padStart(2, "0");
  const text = `${a} × ${b}`;
  const hint = `Nikhilam: diffs are ${base - a} and ${base - b}. Left = ${a}-${base - b}=${left}. Right = ${base - a}×${base - b}=${right} → ${left}${rightStr}.`;
  return { id: crypto.randomUUID(), text, answer: String(a * b), hint, mode: "nearHundred" };
}

export default NearHundredPractice;
