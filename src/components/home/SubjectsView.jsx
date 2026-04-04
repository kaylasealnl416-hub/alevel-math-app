import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { get } from "../../utils/apiClient.js";

// ── 考试倒计时组件 ─────────────────────────────────────────────
function ExamCountdown() {
  const EXAM_DATE_KEY = 'exam_target_date'
  const [examDate, setExamDate] = useState(() => localStorage.getItem(EXAM_DATE_KEY) || '')
  const [editing, setEditing] = useState(!localStorage.getItem(EXAM_DATE_KEY))
  const [daysLeft, setDaysLeft] = useState(null)

  useEffect(() => {
    if (!examDate) { setDaysLeft(null); return }
    const diff = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
    setDaysLeft(diff)
  }, [examDate])

  const save = (val) => {
    setExamDate(val)
    localStorage.setItem(EXAM_DATE_KEY, val)
    setEditing(false)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1px solid #BFDBFE', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
        📅 Exam Countdown
      </div>
      {editing ? (
        <div>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Set your exam date:</div>
          <input type="date" defaultValue={examDate}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #BFDBFE', fontSize: 13, marginRight: 8 }}
            onBlur={e => e.target.value && save(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save(e.target.value)}
            autoFocus
          />
        </div>
      ) : daysLeft !== null ? (
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, color: daysLeft <= 7 ? '#DC2626' : daysLeft <= 30 ? '#D97706' : '#1a73e8', lineHeight: 1 }}>
            {daysLeft > 0 ? daysLeft : 0}
          </div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
            {daysLeft > 0 ? 'days until your exam' : 'Exam day!'}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
            {new Date(examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            <button onClick={() => setEditing(true)} style={{ marginLeft: 8, fontSize: 11, color: '#1a73e8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Change
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ fontSize: 13, color: '#1a73e8', background: 'none', border: '1px dashed #BFDBFE', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
          + Set exam date
        </button>
      )}
    </div>
  )
}

// ── 每日打卡组件 ──────────────────────────────────────────────
function DailyCheckin() {
  const CHECKIN_KEY = 'daily_checkin'
  const today = new Date().toISOString().slice(0, 10)

  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '{"streak":0,"lastDate":""}') }
    catch { return { streak: 0, lastDate: '' } }
  })

  const checkedInToday = streak.lastDate === today

  const handleCheckin = () => {
    if (checkedInToday) return
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = streak.lastDate === yesterday ? streak.streak + 1 : 1
    const updated = { streak: newStreak, lastDate: today }
    setStreak(updated)
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(updated))
  }

  return (
    <div style={{ background: checkedInToday ? 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' : 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: `1px solid ${checkedInToday ? '#BBF7D0' : '#FDE68A'}`, borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: checkedInToday ? '#16A34A' : '#D97706', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
        🔥 Daily Streak
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: checkedInToday ? '#16A34A' : '#D97706', lineHeight: 1 }}>
        {streak.streak}
      </div>
      <div style={{ fontSize: 13, color: '#475569', marginTop: 4, marginBottom: 12 }}>
        {streak.streak === 1 ? 'day streak' : 'days streak'}
      </div>
      <button
        onClick={handleCheckin}
        disabled={checkedInToday}
        style={{
          padding: '7px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: checkedInToday ? 'default' : 'pointer',
          background: checkedInToday ? '#BBF7D0' : '#16A34A',
          color: checkedInToday ? '#166534' : '#fff',
        }}
      >
        {checkedInToday ? '✓ Checked in today' : 'Check in'}
      </button>
    </div>
  )
}

function SubjectsView({ nav, lang }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [progressMap, setProgressMap] = useState({}); // { subjectId: completedCount }
  const BRAND = "#1a73e8";

  const mathSubject = {
    id: "mathematics",
    name: { zh: "数学", en: "Mathematics" },
    nameFull: { zh: "爱德思IAL数学", en: "Pearson Edexcel IAL Mathematics" },
    icon: "📐",
    color: "#1a73e8",
    bgColor: "#FEF2F2",
    level: "IAL (International A-Level)",
    books: CURRICULUM,
  };

  const allSubjects = [mathSubject, ...Object.values(SUBJECTS)];

  const totalChapters = allSubjects.reduce(
    (sum, s) => sum + Object.values(s.books).reduce((s2, b) => s2 + (b.chapters?.length || 0), 0),
    0
  );

  // 加载用户学习进度
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    get(`/api/progress/${user.id}`)
      .then(data => {
        if (!Array.isArray(data)) return;
        // 统计每个学科已完成的章节数
        const map = {};
        data.forEach(p => {
          if (p.status === 'completed' && p.chapterId) {
            // chapter ID 前缀对应学科
            const id = p.chapterId;
            let subjectId = 'mathematics';
            if (id.startsWith('pol')) subjectId = 'politics';
            else if (id.startsWith('psy')) subjectId = 'psychology';
            else if (id.startsWith('fm') || id.startsWith('fs') || id.startsWith('fmech')) subjectId = 'further-math';
            else if (id.startsWith('e')) subjectId = 'economics';
            else if (id.startsWith('h')) subjectId = 'history';
            map[subjectId] = (map[subjectId] || 0) + 1;
          }
        });
        setProgressMap(map);
      })
      .catch(() => {}); // 进度加载失败静默处理
  }, [isAuthenticated, user?.id]);

  const authNav = (view, subject) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("pendingView", view);
      navigate("/login");
    } else {
      // 重置 book 和 chapter，确保进入干净状态
      nav(view, null, null, subject || "mathematics");
    }
  };

  const INNER = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: "#202124",
        padding: "0 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* background glows */}
        <div style={{
          position: "absolute", top: "-15%", right: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: BRAND, filter: "blur(120px)", opacity: 0.12, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "#1a73e8", filter: "blur(140px)", opacity: 0.07, pointerEvents: "none",
        }} />

        {/* ── Hero Content ── */}
        <div style={{
          ...INNER,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
          padding: "56px 24px 0",
          position: "relative", zIndex: 1,
        }}>
          {/* Left: copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: 12, fontWeight: 600, color: "#86EFAC",
              marginBottom: 24, letterSpacing: 0.3,
            }}>
              ✦ Edexcel IAL 2026 Syllabus Updated
            </div>

            <h1 style={{
              fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 700,
              lineHeight: 1.15, color: "#F8FAFC",
              margin: "0 0 18px", fontFamily: "inherit",
            }}>
              Master A-Level<br />
              <span style={{ color: BRAND }}>with Precision.</span>
            </h1>

            <p style={{
              fontSize: 15, color: "#94A3B8",
              maxWidth: 460, lineHeight: 1.7, margin: "0 0 28px",
            }}>
              Your structured study platform for Pearson Edexcel IAL. Explore syllabi, practice quizzes, and tackle past papers — all in one place.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => authNav("curriculum", "mathematics")}
                style={{
                  padding: "11px 24px", background: BRAND,
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  boxShadow: `0 0 24px ${BRAND}40`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1557b0"}
                onMouseLeave={e => e.currentTarget.style.background = BRAND}
              >
                Start Learning →
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    sessionStorage.setItem("pendingView", "practice");
                    navigate("/login");
                  } else {
                    navigate("/practice");
                  }
                }}
                style={{
                  padding: "11px 24px",
                  background: "rgba(255,255,255,0.07)",
                  color: "#E2E8F0",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              >
                Start Practising
              </button>
            </div>
          </div>

          {/* Right: feature tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📖", title: "Structured Curriculum", desc: "Chapter-by-chapter learning with key points and formulas" },
              { icon: "🧪", title: "Practice Quizzes",     desc: "AI-generated questions to test your understanding" },
              { icon: "🎓", title: "Mock Exams",           desc: "Timed chapter tests to prepare for the real Edexcel IAL exam" },
              { icon: "❌", title: "Wrong Answer Review",  desc: "Track mistakes and focus on your weak areas" },
            ].map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ ...INNER, display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
          {[
            { value: allSubjects.length,    label: "Active Subjects" },
            { value: `${totalChapters}+`,   label: "Chapters" },
            { value: "AI",                  label: "Powered Quizzes" },
            { value: "IAL",                 label: "Qualification" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "22px 16px",
              borderRight: i < 3 ? "1px solid #E2E8F0" : "none",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#202124", fontFamily: "inherit" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject Cards ── */}
      <section id="subjects-section" style={{ ...INNER, padding: "48px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#202124", fontFamily: "inherit" }}>
              My Learning Dashboard
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
              Select a subject to begin your study session.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {allSubjects.map(subject => {
            const bookKeys = Object.keys(subject.books);
            const chapterCount = Object.values(subject.books).reduce((s, b) => s + (b.chapters?.length || 0), 0);
            const isHovered = hoveredCard === subject.id;
            return (
              <div
                key={subject.id}
                onMouseEnter={() => setHoveredCard(subject.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => nav("curriculum", bookKeys[0], null, subject.id)}
                style={{
                  background: "#FFFFFF", borderRadius: 16, padding: 24,
                  border: `1px solid ${isHovered ? subject.color + "40" : "#E2E8F0"}`,
                  boxShadow: isHovered ? `0 8px 28px ${subject.color}18` : "0 1px 4px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transform: isHovered ? "translateY(-3px)" : "none",
                  transition: "all 0.25s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: subject.bgColor || subject.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  }}>
                    {subject.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6,
                    background: "#F1F5F9", color: "#64748B",
                  }}>
                    IAL
                  </span>
                </div>

                <h3 style={{ margin: "0 0 5px", fontSize: 17, fontWeight: 700, color: "#202124" }}>
                  {subject.name[lang]}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748B" }}>
                  {subject.nameFull[lang]}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {bookKeys.map(key => (
                    <span key={key} style={{
                      padding: "3px 9px", borderRadius: 6,
                      background: subject.color + "12", color: subject.color,
                      fontSize: 11, fontWeight: 600,
                    }}>{key}</span>
                  ))}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                    <span style={{ color: "#94A3B8" }}>Progress</span>
                    <span style={{ color: "#202124", fontWeight: 700 }}>
                      {progressMap[subject.id] || 0}/{chapterCount}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      width: chapterCount > 0 ? `${Math.round(((progressMap[subject.id] || 0) / chapterCount) * 100)}%` : "0%",
                      background: subject.color,
                      transition: "width 0.5s ease, background 0.3s",
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Exam Countdown + Daily Check-in ── */}
      <section style={{ ...INNER, padding: "0 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {/* Exam Countdown */}
          <ExamCountdown />
          {/* Daily Check-in */}
          <DailyCheckin />
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section style={{ ...INNER, padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            {
              icon: "📚", title: "Curriculum",
              desc: "Chapter-by-chapter syllabus with key concepts, formulas and examples.",
              bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "#BFDBFE",
              iconBg: "#DBEAFE",
              action: () => authNav("curriculum", "mathematics"),
            },
            {
              icon: "📝", title: "Mock Exams",
              desc: "Timed past paper simulations to prepare for the real Edexcel IAL exam.",
              bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "#FDE68A",
              iconBg: "#FEF3C7",
              action: () => authNav("mock", "mathematics"),
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 16, padding: 22,
                display: "flex", gap: 16, alignItems: "flex-start",
                cursor: "pointer", transition: "box-shadow 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: item.iconBg,
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: "#202124" }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default SubjectsView;
