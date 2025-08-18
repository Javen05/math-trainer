import React from 'react';

export function makeX11Question(digits = 3) {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const text = `${a} × 11`;
  const explain = `Rule: write ends, each middle digit = sum of neighbors. Example 452×11 → 4 | (4+5)=9 | (5+2)=7 | 2 → 4972.`;
  return { id: crypto.randomUUID(), text, answer: String(a * 11), hint: explain, mode: "x11" };
}

const X11Practice: React.FC = () => {
  // ...move x11 logic and UI here...
  return (
    <div className="flashcard">
      {/* X11 practice UI */}
    </div>
  );
};

export default X11Practice;
