import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { ALL_SUBJECTS } from "../../data/allSubjects.js";
import { SUBJECT_RESOURCES } from "../../data/subjectResources.js";
import { localiseChapter, toEn } from "../../utils/localise.js";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";
import PracticeView from "../practice/PracticeView";
import ExamView from "./ExamView";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ChapterView({ chapter, book, nav, t, lang, subject = "mathematics" }) {
  const [tab, setTab] = useState("learn");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expandedKP, setExpandedKP] = useState(0); // 单开手风琴，默认展开第一条
  const [hoveredKP, setHoveredKP] = useState(null);
  const [activeVideo, setActiveVideo] = useState(0);

  const isMath = subject === "mathematics";
  const bookData = isMath ? CURRICULUM[book] : SUBJECTS[subject]?.books?.[book];
  const ch = localiseChapter(chapter, lang);

  if (!bookData) return <div style={styles.pageWrap}>Loading...</div>;

  const color = bookData.color || "#1a73e8";
  const videos = chapter.youtube || [];

  const TABS = [
    { id: "learn",  label: "Learn",  icon: "📖" },
    { id: "videos", label: "Videos", icon: "▶" },
    { id: "quiz",   label: "Quiz",   icon: "✏" },
    { id: "exam",   label: "Exam",   icon: "🎓" },
  ];

  const getYTId = (url) => {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
    return m ? m[1] : null;
  };

  const subjectMeta = ALL_SUBJECTS[subject];
  const subjectName = subjectMeta?.name?.[lang] || subject;

  return (
    <div style={styles.pageWrap}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13, flexWrap: "wrap" }}>
        <button
          onClick={() => nav("subjects")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13, padding: 0, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = color}
          onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
        >
          Dashboard
        </button>
        <span style={{ color: "#CBD5E1" }}>/</span>
        <button
          onClick={() => nav("curriculum", null, null, subject)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13, padding: 0, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = color}
          onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
        >
          {subjectName}
        </button>
        <span style={{ color: "#CBD5E1" }}>/</span>
        <button
          onClick={() => nav("curriculum", book, null, subject)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13, padding: 0, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = color}
          onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
        >
          {book}
        </button>
        <span style={{ color: "#CBD5E1" }}>/</span>
        <span style={{ color: color, fontWeight: 600 }}>Ch {ch.num}: {ch.title}</span>
      </div>

      {/* ── Header Card ── */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: `1px solid ${color}25`, boxShadow: `0 2px 16px ${color}0D`, padding: "28px 32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", right: "-5%", width: 220, height: 220, borderRadius: "50%", background: color, filter: "blur(70px)", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: color, color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
            {book} — Chapter {ch.num}
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 700, color: "#202124", fontFamily: "inherit", lineHeight: 1.25 }}>
            {ch.title}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#64748B", lineHeight: 1.7, maxWidth: 700 }}>
            {(ch.overview || "").substring(0, 280)}{(ch.overview || "").length > 280 ? "…" : ""}
          </p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: 20 }}>
        {TABS.map(tabItem => {
          const isActive = tab === tabItem.id;
          const requiresAuth = tabItem.id === "quiz" || tabItem.id === "exam";
          return (
            <button
              key={tabItem.id}
              onClick={() => {
                if (requiresAuth && !isAuthenticated) {
                  sessionStorage.setItem("pendingView", tabItem.id);
                  navigate("/login");
                } else {
                  setTab(tabItem.id);
                }
              }}
              style={{ padding: "10px 22px", border: "none", cursor: "pointer", background: isActive ? color + "08" : "transparent", borderBottom: `2px solid ${isActive ? color : "transparent"}`, color: isActive ? color : "#64748B", fontSize: 13, fontWeight: 600, marginBottom: -1, transition: "all 0.15s" }}
            >
              {tabItem.icon} {tabItem.label}{requiresAuth && !isAuthenticated ? " 🔒" : ""}
            </button>
          );
        })}
      </div>

      {/* ── Learn ── */}
      {tab === "learn" && (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
          <div style={styles.learnContent}>
            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#FEF9C3" }}>⚡</div>
                <h3 style={styles.sectionTitle}>{t.secKeyPoints}</h3>
              </div>
              <ul style={styles.keyPointsList}>
                {(ch.keyPoints || []).map((kp, i) => {
                  const dashIdx = kp.indexOf(' - ');
                  const rawTerm = dashIdx !== -1 ? kp.slice(0, dashIdx) : kp;
                  const term = rawTerm.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                  const desc = dashIdx !== -1 ? kp.slice(dashIdx + 3) : null;
                  const isOpen = expandedKP === i;
                  const toggle = () => setExpandedKP(isOpen ? null : i);
                  return (
                    <li key={i} onClick={toggle} onMouseEnter={() => setHoveredKP(i)} onMouseLeave={() => setHoveredKP(null)} style={{ position: "relative", background: "#FFF", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `1px solid ${isOpen ? color + "40" : "#E5E7EB"}`, boxShadow: isOpen ? `0 2px 12px ${color}15` : "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color, borderRadius: "3px 0 0 3px", opacity: isOpen ? 1 : 0, transition: "opacity 0.25s" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px 13px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", boxShadow: `0 2px 6px ${color}40` }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: isOpen ? "#111827" : "#374151", transition: "color 0.2s" }}>{term}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          {hoveredKP === i && (
                            <button
                              onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/search?q=${encodeURIComponent(kp)}`, '_blank', 'noopener,noreferrer'); }}
                              title="Search on Google"
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 14, border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", fontSize: 11, color: "#1D4ED8", fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                              Google
                            </button>
                          )}
                          <svg style={{ width: 16, height: 16, color: isOpen ? color : "#CBD5E1", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease, color 0.2s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      {desc && (
                        <div onClick={e => e.stopPropagation()} style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease", background: "#F8FAFC", borderTop: isOpen ? `1px solid ${color}18` : "1px solid transparent" }}>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: 0, padding: "13px 18px 15px 58px", fontSize: 13, color: "#6B7280", lineHeight: 1.7, userSelect: "text" }}>{desc}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#EFF6FF" }}>📐</div>
                <h3 style={styles.sectionTitle}>{t.secFormulas}</h3>
              </div>
              <div style={styles.formulasGrid}>
                {(ch.formulas || []).map((f, i) => {
                  const hasChinese = (s) => /[\u4e00-\u9fff]/.test(s);
                  // name: 英文模式取括号内英文，无括号时仅在含汉字时去除汉字
                  const parenMatch = f.name.match(/\(([^)]+)\)/);
                  const displayName = lang === 'en'
                    ? (parenMatch ? parenMatch[1].trim() : (hasChinese(f.name) ? toEn(f.name) || f.name : f.name))
                    : f.name.replace(/\s*\([^)]*[a-zA-Z][^)]*\)\s*$/, '').trim() || f.name;
                  // expr: 仅在含汉字时才调用 toEn，避免破坏已是英文的内容
                  const displayExpr = lang === 'en' && hasChinese(f.expr) ? (toEn(f.expr) || f.expr) : f.expr;
                  return (
                    <div key={i} style={{ ...styles.formulaCard, borderTop: `3px solid ${color}` }}>
                      <div style={styles.formulaName}>{displayName}</div>
                      <div style={{ ...styles.formulaExpr, color, borderColor: color + "50" }}><MathText text={displayExpr} /></div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={styles.learnSection}>
              <div style={styles.sectionHeader}>
                <div style={{ ...styles.sectionIconBox, background: "#FEE2E2" }}>⚠️</div>
                <h3 style={styles.sectionTitle}>{t.secHardPoints}</h3>
              </div>
              <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 18px 16px 20px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: `3px solid ${color}` }}>
                <span style={{ width: 26, height: 26, background: color, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>!</span>
                <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, fontSize: 13 }}>{ch.hardPoints}</p>
              </div>
            </section>

            {ch.examTips && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#EFF6FF" }}>★</div>
                  <h3 style={styles.sectionTitle}>{t.secExamTips}</h3>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px 18px 16px 20px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: "3px solid #1D4ED8" }}>
                  <span style={{ width: 26, height: 26, background: "#1D4ED8", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>★</span>
                  <p style={{ color: "#374151", lineHeight: 1.7, margin: 0, fontSize: 13 }}>{ch.examTips}</p>
                </div>
              </section>
            )}

            {ch.examples && ch.examples.length > 0 && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#FFFBEB" }}>📝</div>
                  <h3 style={styles.sectionTitle}>{t.secExamples}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(ch.examples || []).map((ex, i) => (
                    <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#202124", lineHeight: 1.6 }}>
                          <MathText text={lang === 'en' ? ex.question.en : ex.question.zh || ex.question.en} />
                        </div>
                      </div>
                      <div style={{ padding: "12px 18px", background: "#F8FAFC" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: 0.5 }}>{lang === 'en' ? 'Answer' : '答案'} </span>
                        <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{lang === 'en' ? ex.answer.en : ex.answer.zh || ex.answer.en}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {ch.definitions && ch.definitions.length > 0 && (
              <section style={styles.learnSection}>
                <div style={styles.sectionHeader}>
                  <div style={{ ...styles.sectionIconBox, background: "#F0FDF4" }}>📚</div>
                  <h3 style={styles.sectionTitle}>Key Terms</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                  {ch.definitions.map((d, i) => (
                    <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderTop: `3px solid ${color}` }}>
                      <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#202124" }}>{d.term}</span>
                      </div>
                      <div style={{ padding: "8px 14px 12px" }}>
                        <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{d.definition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ── Videos ── */}
      {tab === "videos" && (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
          {videos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24, alignItems: "start" }}>
              {/* Main player */}
              <div>
                <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: "#0F172A", marginBottom: 14 }}>
                  {getYTId(videos[activeVideo]?.url) ? (
                    <iframe
                      width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${getYTId(videos[activeVideo].url)}`}
                      title={videos[activeVideo].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ display: "block", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <a href={videos[activeVideo]?.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", fontSize: 48 }}>▶</a>
                  )}
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#202124" }}>{videos[activeVideo]?.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{videos[activeVideo]?.channel}</p>
              </div>

              {/* Playlist */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Playlist · {videos.length} videos
                </div>
                <div style={{ padding: 6, maxHeight: 340, overflowY: "auto" }}>
                  {videos.map((v, i) => (
                    <div key={i} onClick={() => setActiveVideo(i)} style={{ padding: "10px 10px", borderRadius: 8, cursor: "pointer", background: activeVideo === i ? color + "10" : "transparent", border: `1px solid ${activeVideo === i ? color + "25" : "transparent"}`, display: "flex", gap: 10, alignItems: "flex-start", transition: "all 0.15s", marginBottom: 2 }}>
                      <div style={{ width: 28, height: 22, borderRadius: 4, flexShrink: 0, background: activeVideo === i ? color : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: activeVideo === i ? "#fff" : "#94A3B8" }}>▶</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: activeVideo === i ? color : "#374151", lineHeight: 1.4 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{v.channel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>No videos added for this chapter yet.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent("A level " + (typeof ch.title === 'object' ? ch.title.en : ch.title) + " " + book + " Edexcel IAL")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ padding: "9px 20px", background: color, color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
              >
                Search on YouTube →
              </a>
            </div>
          )}

          {/* External Resources */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 }}>
              External Resources
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {(SUBJECT_RESOURCES[subject] || SUBJECT_RESOURCES.mathematics).map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, textDecoration: "none", border: "1px solid #E2E8F0", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color + "40"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: color, marginBottom: 3 }}>{res.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{res.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Quiz ── */}
      {tab === "quiz" && <PracticeView chapter={chapter} book={book} subject={subject} embedded onBack={() => setTab("learn")} />}

      {/* ── Exam ── */}
      {tab === "exam" && <ExamView chapter={chapter} book={book} nav={nav} t={t} lang={lang} embedded />}
    </div>
  );
}
