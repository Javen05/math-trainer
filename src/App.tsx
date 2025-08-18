import React, { useState } from "react";
import { PracticePane } from "./components/PracticePane";
import { TechniqueLesson } from "./components/TechniqueLesson";
import "./App.css";

const matteGlossy = "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(220,220,255,0.22) 100%)";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState("arithmetic");
  const bgLight = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)";
  const bgDark = "linear-gradient(135deg, #232526 0%, #414345 100%)";
  const textColor = theme === "dark" ? "#fff" : "#222";
  const cardBg = theme === "dark"
    ? "linear-gradient(135deg, rgba(40,40,50,0.28) 0%, rgba(80,80,100,0.32) 100%)"
    : matteGlossy;

  return (
    <div
      className={`App ${theme}`}
      style={{
        minHeight: "50vh",
        background: theme === "dark" ? bgDark : bgLight,
        transition: "background 0.3s"
      }}
    >
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ".5rem 2rem",
        background: theme === "dark" ? "rgba(40,40,50,0.18)" : "rgba(255,255,255,0.05)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        borderBottom: theme === "dark" ? "1px solid #333" : "1px solid #eee"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/icon.png" alt="App Icon" style={{ width: 80, height: 80, borderRadius: 24, boxShadow: "0 1px 4px #0002" }} />
          <h1 style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "-1px", color: textColor }}>Math Trainer</h1>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
            border: "none",
            borderRadius: "999px",
            padding: "0.5rem 1.2rem",
            fontWeight: 600,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </header>
      <main style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        padding: "1rem",
        maxWidth: "100vw"
      }}>
        {/* Practice Card */}
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: cardBg, borderRadius: "1.2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <PracticePane mode={mode} setMode={setMode} />
          </div>
        </div>
        {/* Technique Lesson Card */}
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: cardBg, borderRadius: "1.2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <TechniqueLesson mode={mode} />
          </div>
        </div>
      </main>
      <footer style={{
        textAlign: "center",
        padding: "1.5rem 0",
        fontSize: "1.1rem"
      }}>
        <a
          href="https://buy.stripe.com/test_fZu3cv0xH5ZI0QT3sFdby00"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: cardBg,
            color: textColor,
            borderRadius: "999px",
            padding: "0.7rem 2rem",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            textDecoration: "none",
            transition: "background 0.2s"
          }}
        >
          Support the project
        </a>
      </footer>
      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          main {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.2rem !important;
            padding: 1rem !important;
            max-width: 100vw !important;
          }
          header {
            flex-direction: column !important;
            gap: 0.7rem !important;
            padding: 0.7rem 1rem !important;
          }
        }
        @media (max-width: 600px) {
          main > div {
            min-width: 0 !important;
            max-width: 100vw !important;
            width: 100% !important;
          }
          .App {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;