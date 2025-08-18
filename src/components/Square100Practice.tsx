import React from 'react';

export function makeSquare100Question(span = 15) {
  const base = 100;
  const x = Math.floor(Math.random() * (span) + 1);
  const n = base - x;
  const text = `${n}²`;
  const answer = String(n * n);
  const hint = `(100-x)^2 = 10000 - 200x + x^2. Here x=${x}.`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: "square100" };
}

const Square100Practice: React.FC = () => {
  // ...move square100 logic and UI here...
  return (
    <div className="flashcard">
      {/* Square 100 practice UI */}
    </div>
  );
};

export default Square100Practice;
