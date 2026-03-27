import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";
import { post } from "../../utils/apiClient";
import Toast from "../common/Toast";


function LoadingSpinner({ message }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

export default function ExamView({ chapter, book, nav, embedded, t, lang, subject = "mathematics" }) {
  const examNavigate = useNavigate();
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(book || (subject === "mathematics" ? "P1" : "Unit1"));
  const [selectedChapter, setSelectedChapter] = useState(chapter || null);

  // Get the correct data source based on subject
  const isMath = subject === "mathematics";
  const dataSource = isMath ? CURRICULUM : (SUBJECTS[subject]?.books || {});

  const NUM_QUESTIONS = 7;
  const EXAM_MINUTES = difficulty === "hard" ? 35 : 25;

  const startExam = async () => {
    setLoading(true);
    const chapterInfo = selectedChapter || dataSource[selectedBook]?.chapters[0];
    if (!chapterInfo) { Toast.error("Please select a chapter first."); setLoading(false); return; }

    const getTitle = () => {
      if (typeof chapterInfo?.title === 'object' && chapterInfo.title !== null) {
        return lang === 'en' ? chapterInfo.title.en : chapterInfo.title.zh;
      }
      return chapterInfo?.title || "Mixed Topics";
    };

    const chTitle = getTitle();

    const body = {
      chapterId: chapterInfo.id,
      questionCount: NUM_QUESTIONS,
      difficulty,
      timeLimit: EXAM_MINUTES * 60,
      chapterTitle: chTitle,
      chapterKeyPoints: chapterInfo.keyPoints || [],
      chapterFormulas: chapterInfo.formulas || [],
      chapterHardPoints: chapterInfo.hardPoints || '',
      chapterExamTips: chapterInfo.examTips || '',
      subject: subject || 'mathematics',
    };

    try {
      const exam = await post('/api/exams/quick-start', body, { timeout: 120000, retry: 0 });
      examNavigate(`/exams/${exam.id}/take`);
    } catch (e) {
      // Toast.error already shown by apiClient
    }
    setLoading(false);
  };


  return (
    <div style={styles.setupPanel}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #d93025 0%, #e37400 100%)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(239,68,68,0.25)', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#202124', letterSpacing: '-0.01em' }}>AI Exam</div>
            <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>Timed · AI marked · Full feedback</div>
          </div>
        </div>
        {!embedded && (
          <>
            <label style={styles.label}>{t.textbookLabel}</label>
            <select style={styles.select} value={selectedBook}
              onChange={e => { setSelectedBook(e.target.value); setSelectedChapter(null); }}>
              {Object.entries(dataSource).map(([k, v]) => (
                <option key={k} value={k}>{k} — {typeof v.title === 'object' ? v.title[lang] || v.title.en || k : v.title}</option>
              ))}
            </select>
            <label style={styles.label}>{t.chapterOpt}</label>
            <select style={styles.select} value={selectedChapter?.id || ""}
              onChange={e => setSelectedChapter(dataSource[selectedBook]?.chapters.find(c => c.id === e.target.value) || null)}>
              <option value="">{t.mixedChapters}</option>
              {dataSource[selectedBook]?.chapters.map(c => (
                <option key={c.id} value={c.id}>Ch {c.num}: {typeof c.title === 'object' ? (c.title[lang] || c.title.en) : c.title}</option>
              ))}
            </select>
          </>
        )}
        <label style={styles.label}>{t.diffLabel}</label>
        <div style={styles.diffRow}>
          {["medium", "hard"].map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              style={{ ...styles.diffBtn, ...(difficulty === d ? styles.diffBtnActive : {}) }}>
              {d === "medium" ? t.mediumTime : t.hardTime}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
              value: NUM_QUESTIONS, label: t.numQLabel
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              value: EXAM_MINUTES + " min", label: t.minLabel
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24Z"/></svg>,
              value: "AI", label: t.markedByAI
            },
          ].map((item, i) => (
            <div key={i} style={{ background: "#e8f0fe", border: "1px solid #dadce0", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#202124", lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "#5f6368", marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
        {loading ? <LoadingSpinner message={t.preparingExam} /> : (
          <button onClick={startExam} style={{ ...styles.btnPrimary, padding: "13px 24px", fontSize: 15 }}>{t.startExam}</button>
        )}
      </div>
    );
}
