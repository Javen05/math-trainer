import React from 'react';

const FlashAnzanPractice: React.FC = () => {
  return (
    <div className="flashcard">
      {/* Flash Anzan practice UI */}
    </div>
  );
};

export function makeFlashAnzanSeries(count = 5, digits = 2) {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const nums = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  const text = nums.join("  ");
  const answer = String(nums.reduce((s, n) => s + n, 0));
  const hint = `Flash Anzan: keep a running sum (chunk by complements to 10 if helpful).`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: "flashAnzan" };
}

export default FlashAnzanPractice;
