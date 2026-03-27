import { useState, useEffect, useRef } from "react";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { PAST_PAPERS, SUBJECT_NAMES } from "../../data/allSubjects.js";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";
import { callAI } from "../../utils/callAI.js";
import Toast from "../common/Toast";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { post } from "../../utils/apiClient.js";

function LoadingSpinner({ message }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

export default function MockExamView({ nav, onAddError, t, lang, subject = "mathematics" }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState("select");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef();
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Get the correct data source based on subject
  const isMath = subject === "mathematics";
  const dataSource = isMath ? CURRICULUM : (SUBJECTS[subject]?.books || {});

  const startMock = async (paper) => {
    setSelectedPaper(paper);
    setLoading(true);

    const subjectName = SUBJECT_NAMES[subject] || "the subject";
    const examBoard = isMath ? "Cambridge" : "Pearson Edexcel";
    const system = `You are creating realistic ${examBoard} IAL ${subjectName} past paper questions. Simulate the ${paper.year} ${paper.session} ${paper.paper} paper style and difficulty. Return questions as a JSON array only.`;
    const bookData = dataSource[paper.paper.replace(/[12]$/, "")] || dataSource[Object.keys(dataSource)[0]];
    const topics = bookData ? bookData.chapters.map(c => c.title).join(", ") : "Pure Mathematics";

    const prompt = `Create ${paper.questions} realistic past-paper style questions for Cambridge A-Level ${paper.paper} (${paper.year} ${paper.session}).

Topics to cover from this paper: ${topics}

Make questions feel like authentic Cambridge exam questions with realistic difficulty progression (Q1 easiest, last questions hardest).

Return ONLY JSON array:
[{"id":"q1","question":"...","marks":4,"options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","solution":"Full worked solution with method marks explained...","topic":"...","difficulty":"..."}]`;

    try {
      const raw = await callAI(system, prompt, 3000);
      const clean = raw.replace(/```json|```/g, "").trim();
      const qs = JSON.parse(clean);
      setQuestions(qs);
      setAnswers({});
      setTimeLeft(paper.duration * 60);
      setPhase("exam");
    } catch (e) {
      Toast.error("Failed to load paper. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (phase === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitMock(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, submitMock]);

  const submitMock = async () => {
    clearInterval(timerRef.current);
    const currentAnswers = answersRef.current;
    let correct = 0;
    const review = questions.map(q => {
      const isCorrect = currentAnswers[q.id] === q.correct;
      if (isCorrect) correct++;
      return { ...q, userAnswer: currentAnswers[q.id], isCorrect };
    });

    // 错题写后端（已登录时）
    if (user) {
      const wrongOnes = review.filter(q => !q.isCorrect);
      for (const q of wrongOnes) {
        try {
          await post('/api/wrong-questions', {
            userId: user.id,
            questionId: q.id,
            userAnswer: { value: q.userAnswer },
            question: {
              id: q.id,
              type: 'multiple_choice',
              difficulty: 3,
              content: { en: q.question },
              options: q.options,
              answer: { value: q.correct },
              explanation: { en: q.solution || '' },
              tags: [q.topic || subject],
            },
          }, { showErrorToast: false });
        } catch (_) { /* 静默失败，不影响主流程 */ }
      }
    } else if (onAddError) {
      // 未登录降级：写 localStorage
      review.filter(q => !q.isCorrect).forEach(q =>
        onAddError({ ...q, subject, timestamp: Date.now(), userAnswer: currentAnswers[q.id] })
      );
    }

    setResults({ correct, total: questions.length, review });
    setPhase("results");
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Generate papers dynamically based on subject
  const papers = isMath ? PAST_PAPERS : Object.keys(dataSource).map((unit, idx) => ({
    year: 2024,
    session: "May/Jun",
    paper: unit,
    code: `WEC0${idx + 1}`,
    duration: 90,
    questions: 8,
    desc: dataSource[unit]?.title?.en || dataSource[unit]?.title || unit
  }));

  if (phase === "select") {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.mockTitle}</h2>
        <p style={styles.pageDesc}>{isMath ? t.mockDesc : "Realistic mock exams based on past papers"}</p>
        {loading && <LoadingSpinner message={t.loadingPaper} />}
        <div style={styles.papersGrid}>
          {papers.map((paper, i) => (
            <div key={i} style={styles.paperCard}>
              <div style={styles.paperYear}>{paper.year}</div>
              <div style={styles.paperSession}>{paper.session}</div>
              <div style={styles.paperPaper}>{paper.paper}</div>
              <div style={{ fontSize: 12, color: "#888888", marginBottom: 4 }}>{paper.desc}</div>
              <div style={styles.paperMeta}>
                <span>⏱️ {paper.duration} min</span>
                <span>📝 {paper.questions} Qs</span>
              </div>
              <button
                onClick={() => startMock(paper)}
                style={styles.btnPrimary}
                disabled={loading}>
                {t.startMockBtn}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "exam") {
    const urgency = timeLeft < 600;
    return (
      <div style={styles.examPanel}>
        <div style={styles.examHeader}>
          <div>
            <div style={styles.examTitle}>{t.examPaperTitle}</div>
            <div style={styles.examSubtitle}>
              {selectedPaper?.year} {selectedPaper?.session} — Paper {selectedPaper?.paper}
            </div>
          </div>
          <div style={{ ...styles.timer, ...(urgency ? styles.timerUrgent : {}) }}>⏱️ {fmt(timeLeft)}</div>
        </div>
        <div style={styles.examInstructions}>{t.examInstructions}</div>
        <div style={styles.examQuestions}>
          {questions.map((q, i) => (
            <div key={q.id} style={styles.examQuestion}>
              <div style={styles.examQHeader}>
                <span style={styles.examQNum}>Q{i + 1}</span>
                <span style={styles.examQMarks}>[{q.marks} {t.marks}]</span>
                <span style={{ ...styles.diffTag, background: q.difficulty === "hard" ? "#7C2020" : "#1D4ED8", fontSize: 11 }}>
                  {q.difficulty}
                </span>
              </div>
              <div style={styles.examQText}><MathText text={q.question} /></div>
              <div style={styles.examOptions}>
                {Object.entries(q.options || {}).map(([letter, text]) => {
                  const isSelected = answers[q.id] === letter;
                  return (
                    <button key={letter}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: letter }))}
                      style={{ ...styles.optionBtn, ...(isSelected ? styles.optionSelected : {}) }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${isSelected ? "#1a73e8" : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.15s" }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a73e8" }} />}
                      </div>
                      <span style={styles.optionLetter}>{letter}</span>
                      <span>{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitMock} style={{ ...styles.btnPrimary, background: "#1a73e8", marginTop: 24 }}>
          {t.submitExam}
        </button>
      </div>
    );
  }

  if (phase === "results" && results) {
    const pct = Math.round((results.correct / results.total) * 100);
    const grade = pct >= 90 ? "A*" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "E";
    const ums = Math.round(pct * 0.9 + 10);
    return (
      <div style={styles.resultsPanel}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsGrade}>{grade}</div>
          <div style={styles.resultsScore}>{results.correct}/{results.total} · {pct}%</div>
          <div style={styles.resultsLabel}>
            {selectedPaper?.year} {selectedPaper?.session} — Paper {selectedPaper?.paper}
          </div>
          <div style={styles.umsScore}>{t.estimatedUMS} {ums}/100 <span style={{ fontSize: 11, color: "#5f6368", fontWeight: 400 }}>(approximate)</span></div>
        </div>
        <div style={styles.gradeBands}>
          {[["A*", 90], ["A", 80], ["B", 70], ["C", 60], ["D", 50]].map(([g, threshold]) => (
            <div key={g} style={{ ...styles.gradeBand, background: pct >= threshold ? "rgba(26,122,60,0.10)" : "#F5F5F5" }}>
              <span style={styles.gradeBandLabel}>{g}</span>
              <span style={styles.gradeBandPct}>{threshold}%+</span>
              {pct >= threshold && <span style={styles.gradeBandCheck}>✓</span>}
            </div>
          ))}
        </div>
        <h3 style={styles.reviewTitle}>{t.detailedMarking}</h3>
        <div style={styles.reviewList}>
          {results.review.map((q, i) => (
            <div key={q.id} style={{ ...styles.reviewItem, borderColor: q.isCorrect ? "#1D4ED8" : "#7C2020" }}>
              <div style={styles.reviewHeader}>
                <span>{q.isCorrect ? "✅" : "❌"} Q{i + 1} — {q.topic}</span>
                <span>{q.isCorrect ? `+${q.marks}` : "0"}/{q.marks} {t.marks}</span>
              </div>
              <div style={styles.reviewQuestion}>{q.question}</div>
              <div style={styles.reviewSolution}>
                <strong>{t.modelAnswer} ({q.correct}):</strong> <MathText text={q.solution} />
              </div>
              {!q.isCorrect && (
                <div style={styles.aiExplanation}>
                  💡 {t.yourAnswerWas} {q.userAnswer || t.noAnswer}. {t.reviewLabel} {q.topic}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("select")} style={styles.btnSecondary}>{t.backToMenu}</button>
      </div>
    );
  }

  return null;
}
