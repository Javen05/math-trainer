import React from "react";

interface TechniqueLessonProps {
  mode: string;
}

const lessons: Record<string, { title: string; description: string }> = {
  arithmetic: {
    title: "Arithmetic (+ − × ÷)",
    description: "Practice basic arithmetic operations. Use mental shortcuts for addition, subtraction, multiplication, and division."
  },
  x11: {
    title: "Trachtenberg ×11",
    description: "Multiply any number by 11 quickly: Add each digit to its neighbor and place the results in order."
  },
  x12: {
    title: "Trachtenberg ×12",
    description: "Multiply by 12: Double the number and add its neighbor."
  },
  nearHundred: {
    title: "Vedic: Near 100",
    description: "Use Vedic techniques to multiply numbers close to 100. Subtract from 100, cross-subtract, and multiply the differences."
  },
  square50: {
    title: "Square near 50",
    description: "Square numbers near 50 using the formula: (50 + x)^2 = 2500 + 100x + x^2."
  },
  square100: {
    title: "Square near 100",
    description: "Square numbers near 100 using the formula: (100 + x)^2 = 10000 + 200x + x^2."
  },
  flashAnzan: {
    title: "Flash Anzan (sums)",
    description: "Practice rapid mental addition with a series of flashed numbers."
  }
};

const TechniqueLesson: React.FC<TechniqueLessonProps> = ({ mode }) => {
  const lesson = lessons[mode] || { title: "Unknown", description: "No lesson available for this mode. Try another mode above." };
  // Robust dark mode detection: check html and body, fallback to prefers-color-scheme
  let isDark = false;
  if (typeof document !== 'undefined') {
    isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    if (!isDark && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark = true;
    }
  }
  return (
    <div className="flashcard" style={{ padding: '1.5em', borderRadius: '1em', background: 'rgba(40,40,50,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 2px 12px #0002', border: '1px solid #e2e8f0', marginBottom: '1em' }}>
      <h2 style={{ fontSize: '1.2em', fontWeight: 600, marginBottom: '0.5em', color: isDark ? '#fff' : undefined }}>{lesson.title}</h2>
      <p style={{ color: isDark ? '#fff' : '#444', fontSize: '1em' }}>{lesson.description}</p>
    </div>
  );
};

export { TechniqueLesson };
