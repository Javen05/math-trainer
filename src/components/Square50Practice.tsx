import React from 'react';

const Square50Practice: React.FC = () => {
  return (
    <div className="flashcard">
      {/* Square 50 practice UI */}
    </div>
  );
};

export function makeSquare50Question(span = 15) {
  const base = 50;
  const x = Math.floor(Math.random() * (span * 2 + 1)) - span;
  const n = base + x;
  const text = `${n}²`;
  const answer = String(n * n);
  const hint = `(50+x)^2 = 2500 + 100x + x^2. Here x=${x}.`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: 'square50' };
}

export default Square50Practice;
