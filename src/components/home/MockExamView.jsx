import { useState, useEffect, useRef, useCallback } from "react";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { PAST_PAPERS, SUBJECT_NAMES } from "../../data/allSubjects.js";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";
import AnswerInput from "../AnswerInput.jsx";
import Toast from "../common/Toast";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { get, post, put } from "../../utils/apiClient.js";

function LoadingSpinner({ message }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

// 将 DB 题目格式转换为 MockExamView 内部格式
function mapQuestion(q) {
  return {
    id: q.id,
    question: typeof q.content === 'object' ? (q.content.en || q.content.zh) : q.content,
    marks: q.difficulty >= 4 ? 8 : q.difficulty >= 3 ? 5 : 3,
    options: q.options || {},
    correct: null,
    solution: "",
    topic: (q.tags || [])[0] || "mathematics",
    difficulty: q.difficulty >= 4 ? "hard" : q.difficulty >= 3 ? "medium" : "easy",
    type: q.type,
  };
}

export default function MockExamView({ nav, t, lang, subject = "mathematics", questionSetId = null, onBack = null }) {
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
  const autoStartedRef = useRef(false); // 防止 questionSetId 模式下重复触发

  // 根据学科选择数据源
  const isMath = subject === "mathematics";
  const dataSource = isMath ? CURRICULUM : (SUBJECTS[subject]?.books || {});

  // ① 通过随机抽题加载（原有逻辑，章节均匀取题）
  const startMock = async (paper) => {
    setSelectedPaper(paper);
    setLoading(true);

    try {
      const bookData = dataSource[paper.paper.replace(/[12]$/, "")] || dataSource[Object.keys(dataSource)[0]];
      const chapterIds = bookData ? bookData.chapters.map(c => c.id) : [];

      if (chapterIds.length === 0) {
        Toast.error("No chapters found for this paper.");
        setLoading(false);
        return;
      }

      const totalNeeded = paper.questions || 10;
      const perChapter = Math.max(1, Math.ceil(totalNeeded / chapterIds.length));
      const shuffledChapters = [...chapterIds].sort(() => Math.random() - 0.5);

      let allQuestions = [];
      for (const chId of shuffledChapters) {
        if (allQuestions.length >= totalNeeded) break;
        try {
          const chData = await post('/api/practice/start', {
            chapterId: chId,
            difficulty: 'medium',
            count: Math.min(perChapter, totalNeeded - allQuestions.length),
            subject,
          });
          if (chData?.questions) {
            allQuestions.push(...chData.questions);
          }
        } catch (_) { /* 该章节无题，跳过 */ }
      }

      if (allQuestions.length === 0) {
        Toast.error("该试卷暂无题目，题库正在补充中");
        setLoading(false);
        return;
      }

      const data = { questions: allQuestions.slice(0, totalNeeded).sort(() => Math.random() - 0.5) };

      if (allQuestions.length < totalNeeded) {
        Toast.info(`题库暂时只有 ${allQuestions.length} 道题，不足 ${totalNeeded} 道`);
      }

      const qs = data.questions.map(mapQuestion);
      setQuestions(qs);
      setAnswers({});
      setTimeLeft(paper.duration * 60);
      setPhase("exam");
    } catch (e) {
      Toast.error(e.message || "Failed to load paper. Please try again.");
    }
    setLoading(false);
  };

  // ② 通过 question_set_id 加载（Past Papers 正式考试模式）
  const startMockBySet = async (questionSet) => {
    setLoading(true);
    try {
      // 调用 GET /api/question-sets/:id 获取题目（含题目详情）
      const data = await get(`/api/question-sets/${questionSet.id}`);
      const { questionSet: qs, questions: rawQs } = data;

      if (!rawQs || rawQs.length === 0) {
        Toast.error("该试卷暂无题目");
        setLoading(false);
        return;
      }

      // 解析试卷标题获取显示信息，如 "WMA12/01 Mock Paper — May 2026"
      const titleMatch = qs.title?.match(/^([A-Z0-9/]+)\s+Mock Paper/i);
      const codeDisplay = titleMatch ? titleMatch[1] : qs.title || 'Mock';

      setSelectedPaper({
        year: qs.title?.match(/\d{4}/)?.[0] || new Date().getFullYear(),
        session: 'Mock Paper',
        paper: codeDisplay,
        duration: Math.round((qs.timeLimit || 5400) / 60),
        questions: rawQs.length,
        questionSetId: qs.id,
        title: qs.title,
      });

      setQuestions(rawQs.map(mapQuestion));
      setAnswers({});
      setTimeLeft(qs.timeLimit || 5400);
      setPhase("exam");
    } catch (e) {
      Toast.error(e.message || "Failed to load question set.");
    }
    setLoading(false);
  };

  // questionSetId prop：自动加载指定题集（PastPapersPage 使用）
  // 注意：必须在 startMockBySet 定义之后，保证闭包引用有效
  useEffect(() => {
    if (questionSetId && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startMockBySet({ id: questionSetId });
    }
  }, [questionSetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitMock = useCallback(async () => {
    clearInterval(timerRef.current);
    const currentAnswers = answersRef.current;
    let correct = 0;
    let pendingReview = 0;

    // 逐题提交答案到后端，获取判分结果
    const review = [];
    for (const q of questions) {
      const userAnswer = currentAnswers[q.id];
      let isCorrect = false;
      let needsReview = false;
      let correctAnswer = q.correct;
      let solution = q.solution;

      try {
        const result = await post('/api/practice/answer', {
          questionId: q.id,
          answer: userAnswer || '',
          timeSpent: 0,
        });
        isCorrect = result?.isCorrect;
        needsReview = result?.needsReview || false;
        correctAnswer = result?.correctAnswer || correctAnswer;
        solution = result?.solution || solution;
      } catch (_) {
        // 提交失败时静默处理
      }

      if (isCorrect === true) correct++;
      if (needsReview) pendingReview++;
      review.push({
        ...q,
        correct: correctAnswer,
        solution,
        userAnswer,
        isCorrect: isCorrect === null ? null : !!isCorrect,
        needsReview,
      });
    }

    // 通过正式 exam 流程记录错题（已登录时）
    if (user) {
      try {
        const examData = await post('/api/exams/quick-start', {
          chapterId: questions[0]?.topic || 'mock',
          questionCount: questions.length,
          difficulty: 'medium',
          subject,
          chapterTitle: `Mock Exam — ${selectedPaper?.paper || 'Paper'}`,
        });

        if (examData?.id) {
          const mockExamId = examData.id;
          for (const q of questions) {
            const ans = currentAnswers[q.id];
            if (ans !== undefined) {
              try {
                await put(`/api/exams/${mockExamId}/answers`, { questionId: q.id, answer: ans }, { showErrorToast: false });
              } catch (_) {}
            }
          }
          try {
            await post(`/api/exams/${mockExamId}/submit`, {}, { showErrorToast: false });
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Mock exam record creation failed:', err.message);
        Toast.info('错题记录保存失败，结果仍可查看');
      }
    }

    setResults({ correct, pendingReview, total: questions.length, review });
    setPhase("results");
  }, [questions, user, subject, selectedPaper]);

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

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // 根据学科动态生成试卷列表
  const papers = isMath ? PAST_PAPERS : Object.keys(dataSource).map((unit, idx) => ({
    year: 2024,
    session: "May/Jun",
    paper: unit,
    code: `WEC0${idx + 1}`,
    duration: 90,
    questions: 8,
    desc: dataSource[unit]?.title?.en || dataSource[unit]?.title || unit
  }));

  // questionSetId 模式下的 select 阶段仅显示 loading
  if (phase === "select" && questionSetId) {
    return (
      <div style={styles.pageWrap}>
        <LoadingSpinner message={loading ? t.loadingPaper : "Preparing exam..."} />
      </div>
    );
  }

  if (phase === "select") {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.mockTitle}</h2>
        <p style={styles.pageDesc}>{isMath ? t.mockDesc : "Realistic mock exams based on past papers"}</p>
        {loading && <LoadingSpinner message={t.loadingPaper} />}

        {/* Unit-Wide Mock 模式 */}
        {isMath && (
          <div style={{ marginBottom: 24, padding: 16, background: '#e8f0fe', borderRadius: 12, border: '1px solid #c5d8f8' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a73e8', marginBottom: 8 }}>
              Unit-Wide Mock (WMA11 / WMA12 / WMA13 / WMA14)
            </div>
            <p style={{ fontSize: 12, color: '#475569', margin: '0 0 12px' }}>
              Simulate a full Edexcel IAL paper with questions spanning all chapters in a unit.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['P1','P2','P3','P4'].map(unit => (
                <button key={unit} onClick={() => startMock({
                  year: 2024, session: 'Unit Mock', paper: unit,
                  code: `WMA1${['P1','P2','P3','P4'].indexOf(unit)+1}`,
                  duration: 90, questions: 10,
                  desc: `Pure Mathematics ${['P1','P2','P3','P4'].indexOf(unit)+1} — All Chapters`,
                  unitWide: true,
                })} disabled={loading}
                  style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#1a73e8', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {unit} Mock
                </button>
              ))}
            </div>
          </div>
        )}

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

              {/* MCQ：保留带选项文本的原有样式 */}
              {q.type === 'multiple_choice' && Object.keys(q.options || {}).length > 0 ? (
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
              ) : (
                /* calculation / proof / short_answer / fill_blank：使用 AnswerInput（含符号键盘）*/
                <div style={{ marginTop: 12 }}>
                  <AnswerInput
                    question={q}
                    value={answers[q.id] || ''}
                    onChange={(val) => setAnswers(a => ({ ...a, [q.id]: val }))}
                    disabled={false}
                  />
                </div>
              )}
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
    const gradedTotal = results.total - (results.pendingReview || 0);
    const pct = gradedTotal > 0 ? Math.round((results.correct / gradedTotal) * 100) : 0;
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
                <span>{q.isCorrect === null ? "⏳" : q.isCorrect ? "✅" : "❌"} Q{i + 1} — {q.topic}</span>
                <span>{q.isCorrect === null ? "Pending" : q.isCorrect ? `+${q.marks}` : "0"}/{q.marks} {t.marks}</span>
              </div>
              <div style={styles.reviewQuestion}>{q.question}</div>
              <div style={{ ...styles.reviewSolution, borderTop: '1px solid #e8eaed', paddingTop: 8, marginTop: 8 }}>
                <strong>{t.modelAnswer}:</strong>
                {q.correct && <span style={{ marginLeft: 4, color: '#188038', fontWeight: 600 }}>({q.correct})</span>}
                {q.solution && <div style={{ marginTop: 4 }}><MathText text={q.solution} /></div>}
              </div>
              {q.userAnswer && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#5f6368' }}>
                  📝 Your answer: <em>{q.userAnswer.length > 200 ? q.userAnswer.slice(0, 200) + '…' : q.userAnswer}</em>
                </div>
              )}
              {!q.isCorrect && q.isCorrect !== null && (
                <div style={styles.aiExplanation}>
                  💡 {t.reviewLabel} {q.topic}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => onBack ? onBack() : setPhase("select")} style={styles.btnSecondary}>{t.backToMenu}</button>
      </div>
    );
  }

  return null;
}

// 导出 startMockBySet 供 PastPapersPage 使用的辅助 hook / context 不必要
// PastPapersPage 通过 ref 调用，见下方 export
export { mapQuestion };
