import React from 'react';

export function makeArithmeticQuestion(digits = 2, allowNeg = false) {
  const op = ["+", "-", "×", "÷"].sort(() => Math.random() - 0.5)[0];
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  let a = Math.floor(Math.random() * (max - min + 1)) + min;
  let b = Math.floor(Math.random() * (max - min + 1)) + min;
  if (op === "÷") {
    b = Math.floor(Math.random() * (max - 1 + 1)) + 1;
    const q = Math.floor(Math.random() * (max - min + 1)) + min;
    a = b * q;
  }
  if (!allowNeg && op === "-") {
    if (b > a) [a, b] = [b, a];
  }
  const text = `${a} ${op} ${b}`;
  let answer = "";
  switch (op) {
    case "+": answer = String(a + b); break;
    case "-": answer = String(a - b); break;
    case "×": answer = String(a * b); break;
    case "÷": answer = String(a / b); break;
  }
  return { id: crypto.randomUUID(), text, answer, mode: "arithmetic" };
}

const ArithmeticPractice: React.FC = () => {
  // ...move arithmetic logic and UI here...
  return (
    <div className="flashcard">
      {/* Arithmetic practice UI */}
    </div>
  );
};

export default ArithmeticPractice;
