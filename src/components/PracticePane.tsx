import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode =
  | "arithmetic"
  | "x11"
  | "x12"
  | "nearHundred"
  | "square50"
  | "square100"
  | "flashAnzan";

type Question = {
  id: string;
  text: string;
  answer: string;
  mode: Mode;
  hint?: string;
};

type Attempt = {
  id: string;
  q: string;
  mode: Mode;
  correct: boolean;
  ms: number;
  timestamp: number;
};

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function makeArithmeticQuestion(digits = 2, ops = ["+", "-", "×", "÷" as const], allowNeg = false): Question {
  const op = pick(ops);
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  let a = randInt(min, max);
  let b = randInt(min, max);
  if (op === "÷") {
    b = randInt(1, max);
    const q = randInt(min, max);
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

function makeX11Question(digits = 3): Question {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const a = randInt(min, max);
  const text = `${a} × 11`;
  const explain = `Rule: write ends, each middle digit = sum of neighbors. Example 452×11 → 4 | (4+5)=9 | (5+2)=7 | 2 → 4972.`;
  return { id: crypto.randomUUID(), text, answer: String(a * 11), hint: explain, mode: "x11" };
}

function makeX12Question(digits = 3): Question {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const a = randInt(min, max);
  const text = `${a} × 12`;
  const explain = `Rule: double each digit and add neighbor (carry as needed). Good warm-up for Trachtenberg.`;
  return { id: crypto.randomUUID(), text, answer: String(a * 12), hint: explain, mode: "x12" };
}

function makeNearHundredQuestion(span = 10): Question {
  const base = 100;
  const a = base - randInt(1, span);
  const b = base - randInt(1, span);
  const left = base - ((base - a) + (base - b));
  const right = (base - a) * (base - b);
  const rightStr = String(right).padStart(2, "0");
  const answer = `${left}${rightStr}`;
  const text = `${a} × ${b}`;
  const hint = `Nikhilam: diffs are ${base - a} and ${base - b}. Left = ${a}-${base - b}=${left}. Right = ${base - a}×${base - b}=${right} → ${left}${rightStr}.`;
  return { id: crypto.randomUUID(), text, answer: String(a * b), hint, mode: "nearHundred" };
}

function makeSquare50Question(span = 15): Question {
  const base = 50;
  const x = randInt(-span, span);
  const n = base + x;
  const text = `${n}²`;
  const answer = String(n * n);
  const hint = `(50+x)^2 = 2500 + 100x + x^2. Here x=${x}.`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: "square50" };
}

function makeSquare100Question(span = 15): Question {
  const base = 100;
  const x = randInt(1, span);
  const n = base - x;
  const text = `${n}²`;
  const answer = String(n * n);
  const hint = `(100-x)^2 = 10000 - 200x + x^2. Here x=${x}.`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: "square100" };
}

function makeFlashAnzanSeries(count = 5, digits = 2): Question {
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 0 : Math.pow(10, digits - 1);
  const nums = Array.from({ length: count }, () => randInt(min, max));
  const text = nums.join("  ");
  const answer = String(nums.reduce((s, n) => s + n, 0));
  const hint = `Flash Anzan: keep a running sum (chunk by complements to 10 if helpful).`;
  return { id: crypto.randomUUID(), text, answer, hint, mode: "flashAnzan" };
}

const loadAttempts = (): Attempt[] => {
  try {
    return JSON.parse(localStorage.getItem("mm_attempts") || "[]");
  } catch {
    return [];
  }
};

const saveAttempts = (rows: Attempt[]) => {
  localStorage.setItem("mm_attempts", JSON.stringify(rows.slice(-1000)));
};

interface PracticePaneProps {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const PracticePane: React.FC<PracticePaneProps> = ({ mode, setMode }) => {
  // mode and setMode are now props from App
  const [digits, setDigits] = useState(2);
  const [ops, setOps] = useState<string[]>(["+", "-", "×", "÷"]);
  const [allowNeg, setAllowNeg] = useState(false);
  const [anzanCount, setAnzanCount] = useState(5);
  const [anzanSpeed, setAnzanSpeed] = useState(700);
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAns, setUserAns] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [hintOpen, setHintOpen] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts());
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number | null>(null);

  const genQuestion = () => {
    let q: Question | null = null;
    switch (mode) {
      case "arithmetic":
        q = makeArithmeticQuestion(digits, ops as any, allowNeg);
        break;
      case "x11":
        q = makeX11Question(digits);
        break;
      case "x12":
        q = makeX12Question(digits);
        break;
      case "nearHundred":
        q = makeNearHundredQuestion(clamp(Math.pow(10, digits - 1), 2, 20));
        break;
      case "square50":
        q = makeSquare50Question(15);
        break;
      case "square100":
        q = makeSquare100Question(20);
        break;
      case "flashAnzan":
        q = makeFlashAnzanSeries(anzanCount, digits);
        break;
      default:
        q = null;
        break;
    }
    setQuestion(q);
    setUserAns("");
    setFeedback("idle");
    setHintOpen(false);
    setRunning(true);
    startedAt.current = performance.now();
  };

  useEffect(() => {
    genQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => saveAttempts(attempts), [attempts]);

  const submit = () => {
    if (!question || !startedAt.current) return;
    const ms = performance.now() - startedAt.current;
    const correct = userAns.trim() === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    setRunning(false);
    setAttempts((rows) => [
      ...rows,
      { id: crypto.randomUUID(), q: question.text, correct, ms, mode: question.mode, timestamp: Date.now() }
    ]);
  };

  const reset = () => {
    setFeedback("idle");
    genQuestion();
  };

  // Flash anzan display control
  const [shownAnzan, setShownAnzan] = useState<string>("");
  useEffect(() => {
    if (mode !== "flashAnzan" || !question?.text) {
      setShownAnzan("");
      return;
    }
    const nums = question.text.split(/\s+/).filter(x => x.length > 0);
    let idx = 0;
    setShownAnzan("");
    let lastPrinted = "";
    const timer = setInterval(() => {
      if (idx < nums.length) {
        lastPrinted = lastPrinted ? lastPrinted + "  " + nums[idx] : nums[idx];
        setShownAnzan(lastPrinted);
        idx++;
      } else {
        clearInterval(timer);
        // After interval, ensure last digit is printed
        setShownAnzan(nums.join("  "));
      }
    }, anzanSpeed);
    return () => clearInterval(timer);
  }, [question?.id, mode, anzanSpeed]);

  const accuracy = useMemo(() => {
    const rows = attempts.slice(-100);
    const ok = rows.filter((r) => r.correct).length;
    return rows.length ? Math.round((100 * ok) / rows.length) : 0;
  }, [attempts]);

  const avgMs = useMemo(() => {
    const rows = attempts.slice(-50);
    const times = rows.filter((r) => r.correct).map((r) => r.ms);
    if (!times.length) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }, [attempts]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
        minHeight: 0,
        gap: '1.5em'
      }}
    >
      {/* Practice card */}
      <div
        style={{
          minWidth: 320,
          maxWidth: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            boxShadow: '0 2px 12px #0002',
            borderRadius: '1em',
            background: 'rgba(40,40,50,0.18)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '2em',
            border: '1px solid #e2e8f0',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '1.2em', display: 'flex', alignItems: 'center', gap: '0.5em' }}>Practice</div>
          <div
            style={{
              margin: '1em 0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1em',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <label>Mode
              <select value={mode} onChange={e => setMode(e.target.value as Mode)} style={{ marginLeft: '1em' }}>
                <option value="arithmetic">Arithmetic (+ − × ÷)</option>
                <option value="x11">Trachtenberg ×11</option>
                <option value="x12">Trachtenberg ×12</option>
                <option value="nearHundred">Vedic: Near 100</option>
                <option value="square50">Square near 50</option>
                <option value="square100">Square near 100</option>
                <option value="flashAnzan">Flash Anzan (sums)</option>
              </select>
            </label>
            <label style={{ marginLeft: '0.5em' }}>Digits
              <input type="number" min={1} max={5} value={digits} onChange={e => setDigits(Number(e.target.value))} style={{ width: '3em', marginLeft: '0.5em', maxWidth: '4em' }} />
            </label>
          </div>
          {mode === "arithmetic" && (
            <div style={{ marginBottom: '1em', display: 'flex', flexWrap: 'wrap', gap: '1em', alignItems: 'center' }}>
              <label>Operations:
                {["+", "-", "×", "÷"].map(op => (
                  <button key={op} style={{ marginLeft: '0.5em', background: ops.includes(op) ? '#b8b8b8ff' : '#eee', borderRadius: '1em', padding: '0.3em 0.8em' }} onClick={() => setOps(o => o.includes(op) ? o.filter(x => x !== op) : [...o, op])}>{op}</button>
                ))}
              </label>
              <label style={{ marginLeft: '2em' }}>
                <input type="checkbox" checked={allowNeg} onChange={e => setAllowNeg(e.target.checked)} /> Allow negatives
              </label>
            </div>
          )}
          {mode === "flashAnzan" && (
            <div style={{ marginBottom: '1em', display: 'flex', flexWrap: 'wrap', gap: '1em', alignItems: 'center' }}>
              <label>Numbers per round:
                <input type="number" min={3} max={12} value={anzanCount} onChange={e => setAnzanCount(Number(e.target.value))} style={{ width: '3em', marginLeft: '0.5em' }} />
              </label>
              <label style={{ marginLeft: '2em' }}>Speed (ms):
                <input type="number" min={250} max={1500} step={50} value={anzanSpeed} onChange={e => setAnzanSpeed(Number(e.target.value))} style={{ width: '4em', marginLeft: '0.5em' }} />
              </label>
            </div>
          )}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '1em', padding: '1em', marginBottom: '1em', background: '#f7fafc', minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em', color: '#888', minWidth: 0 }}>
              <span>Question</span>
              <span>Accuracy: {accuracy}% | Avg ms (last 50): {avgMs}</span>
            </div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', margin: '1em 0', color: '#222', wordBreak: 'break-word', minWidth: 0 }}>
              {mode === "flashAnzan" ? (
                <span>{shownAnzan && shownAnzan.trim() !== "" ? shownAnzan : (question?.text ? "…" : "–")}</span>
              ) : (
                <span>{question?.text || "…"} </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
              <input
                type="text"
                placeholder="Your answer"
                value={userAns}
                onChange={e => setUserAns(e.target.value.replace(/[^0-9\-\.]/g, ""))}
                onKeyDown={handleKey}
                style={{ height: '2.5em', fontSize: '1.1em', borderRadius: '0.5em', border: '1px solid #e2e8f0', padding: '0 1em', background: '#fff', color: '#222' }}
              />
              <button
                onClick={submit}
                disabled={feedback !== 'idle'}
                style={{
                  height: '2.5em',
                  padding: '0 1.5em',
                  borderRadius: '0.5em',
                  background: feedback !== 'idle' ? '#b8b8b8' : '#299fffff',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 500,
                  opacity: feedback !== 'idle' ? 0.6 : 1,
                  cursor: feedback !== 'idle' ? 'not-allowed' : 'pointer'
                }}
              >Check</button>
              <button onClick={reset} style={{ height: '2.5em', padding: '0 1.5em', borderRadius: '0.5em', background: '#e2e8f0', color: '#222', border: 'none', fontWeight: 500 }}>Next</button>
              <button onClick={() => setHintOpen(true)} disabled={!question?.hint} style={{ height: '2.5em', padding: '0 1.5em', borderRadius: '0.5em', background: '#fefcbf', color: '#222', border: 'none', fontWeight: 500, opacity: question?.hint ? 1 : 0.5, cursor: question?.hint ? 'pointer' : 'not-allowed' }}>Hint</button>
            </div>
            {feedback !== "idle" && (
              <div style={{ marginTop: '1em', borderRadius: '0.7em', padding: '0.7em', fontSize: '1em', background: feedback === 'correct' ? '#d1e7dd' : '#f8d7da', color: feedback === 'correct' ? '#0f5132' : '#842029' }}>
                {feedback === "correct" ? (
                  <span>Correct!</span>
                ) : (
                  <span>Oops — correct answer is <span style={{ fontWeight: 600 }}>{question?.answer}</span>.</span>
                )}
              </div>
            )}
            {hintOpen && question?.hint && (
              <div style={{ marginTop: '1em', background: '#eee', borderRadius: '0.7em', padding: '0.7em', fontSize: '1em' }}>{question.hint}</div>
            )}
          </div>
        </div>
      </div>
      {/* Session Stats Card */}
        <div
          style={{
            maxWidth: 550,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            minHeight: 0
          }}
        >
        <div
          style={{
            boxShadow: '0 2px 12px #0002',
            borderRadius: '1em',
            background: 'rgba(40,40,50,0.18)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '2em',
            border: '1px solid #e2e8f0',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
          }}
        >
            <div style={{ fontWeight: 600, fontSize: '1.2em', display: 'flex', alignItems: 'center', gap: '0.5em' }}>Session Statistics</div>
            <div style={{ maxHeight: '300px', margin: '1em 0', overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.95em' }}>
                <thead>
                  <tr style={{ background: '#b8b8b8ff', textAlign: 'center' }}>
                    <th style={{ padding: '0.5em' }}>Question</th>
                    <th style={{ padding: '0.5em' }}>Mode</th>
                    <th style={{ padding: '0.5em' }}>ms</th>
                    <th style={{ padding: '0.5em' }}>✓</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(-50).reverse().map((r) => (
                    <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: '0.5em' }}>{r.q}</td>
                      <td style={{ padding: '0.5em', textTransform: 'uppercase', fontSize: '0.9em' }}>{r.mode}</td>
                      <td style={{ padding: '0.5em' }}>{Math.round(r.ms)}</td>
                      <td style={{ padding: '0.5em' }}>{r.correct ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
};

export { PracticePane };