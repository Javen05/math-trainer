import React from 'react';

const X12Practice: React.FC = () => {
  return (
    <div className="flashcard">
      {/* X12 practice UI */}
    </div>
  );
};

export function makeX12Question(digits = 3) {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const text = `${a} × 12`;
  const explain = `Rule: double each digit and add neighbor (carry as needed). Good warm-up for Trachtenberg.`;
  return { id: crypto.randomUUID(), text, answer: String(a * 12), hint: explain, mode: "x12" };
}

export default X12Practice;
