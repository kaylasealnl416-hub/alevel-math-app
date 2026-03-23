import { useState, useEffect } from "react";
import { SUBJECTS } from "../../data/subjects.js";
import { CURRICULUM } from "../../data/curriculum.js";
import { ALL_SUBJECTS } from "../../data/allSubjects.js";
import { SUBJECT_RESOURCES } from "../../data/subjectResources.js";
import { localiseChapter } from "../../utils/localise.js";
import { styles } from "../../styles/homeStyles.js";

export default function CurriculumView({ nav, t, lang, subject = "mathematics", book: initialBook }) {
  const isMath = subject === "mathematics";
  let dataSource = isMath ? CURRICULUM : null;
  if (!isMath && SUBJECTS[subject]?.books) {
    dataSource = SUBJECTS[subject].books;
  } else if (!isMath) {
    const fallbackKey = Object.keys(SUBJECTS)[0];
    if (fallbackKey) dataSource = SUBJECTS[fallbackKey].books;
  }

  const availableBooks = dataSource ? Object.keys(dataSource) : [];
  const targetBook = (initialBook && availableBooks.includes(initialBook))
    ? initialBook : (availableBooks[0] || "Unit1");

  const [activeBook, setActiveBook] = useState(targetBook);
  const [expandedCh, setExpandedCh] = useState(null);
  const book = dataSource?.[activeBook];

  useEffect(() => {
    if (dataSource && availableBooks.length > 0) {
      setActiveBook(initialBook && availableBooks.includes(initialBook) ? initialBook : availableBooks[0]);
    }
  }, [subject, initialBook]);

  if (!book || availableBooks.length === 0) {
    return (
      <div style={styles.pageWrap}>
        <p style={{ padding: 40, textAlign: "center" }}>Loading curriculum...</p>
      </div>
    );
  }

  const getBookTitle = (b) => typeof b.title === "object" ? b.title[lang] : b.title;
  const getBookSubtitle = (b) => b.subtitle ? (typeof b.subtitle === "object" ? b.subtitle[lang] : b.subtitle) : "";
  const getBookColor = (b) => b.color || "#1a73e8";
  const bookColor = getBookColor(book);

  const subjectMeta = ALL_SUBJECTS[subject];
  const subjectColor = subjectMeta?.color || "#1a73e8";

  // Course codes per book key
  const BOOK_CODES = {
    P1: "WMA11", P2: "WMA12", P3: "WMA13", P4: "WMA14",
    S1: "WST01", M1: "WME01",
    Unit1: "WEC11", Unit2: "WEC12", Unit3: "WEC13", Unit4: "WEC14",
  };

  // AI tutor intro per subject
  const AI_INTROS = {
    mathematics: "Ready to help with Maths. Describe a problem or paste a formula and I'll walk you through it.",
    economics: "Hi! Need help with demand-supply diagrams or evaluating a market failure policy?",
  };
  const aiIntro = AI_INTROS[subject] || "Hi! I'm your AI tutor. Ask me anything about this subject.";

  const INNER = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

  return (
    <div>
      {/* ── Subject Header ── */}
      <div style={{ background: "#202124", padding: "36px 24px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-30%", right: "-5%",
          width: 360, height: 360, borderRadius: "50%",
          background: subjectColor, filter: "blur(110px)", opacity: 0.14, pointerEvents: "none",
        }} />
        <div style={{ ...INNER, position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#64748B" }}>
            <button
              onClick={() => nav("subjects")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94A3B8", fontSize: 13, padding: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#E2E8F0"}
              onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
            >
              ← Dashboard
            </button>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#94A3B8" }}>{subjectMeta?.name?.[lang] || subject}</span>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: subjectColor }}>{getBookTitle(book)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: subjectColor + "22",
                border: `1px solid ${subjectColor}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>
                {subjectMeta?.icon || "📚"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#F8FAFC", fontFamily: "inherit" }}>
                    {getBookTitle(book)}
                  </h1>
                  {BOOK_CODES[activeBook] && (
                    <span style={{
                      padding: "2px 9px", borderRadius: 5,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 12, fontWeight: 600, color: "#94A3B8",
                    }}>
                      {BOOK_CODES[activeBook]}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                  {getBookSubtitle(book) || subjectMeta?.nameFull?.[lang] || ""}
                </p>
              </div>
            </div>

            {/* Chapter count widget */}
            <div style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 16,
              backdropFilter: "blur(8px)",
            }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
                  This Book
                </p>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>
                  {book.chapters.length}
                  <span style={{ fontSize: 13, color: "#64748B", fontWeight: 400, marginLeft: 4 }}>chapters</span>
                </div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: `conic-gradient(${subjectColor} ${(availableBooks.indexOf(activeBook) + 1) / availableBooks.length * 100}%, rgba(255,255,255,0.08) 0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0F172A" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ ...INNER, padding: "32px 24px 60px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>

        {/* Left: Book tabs + Chapter list */}
        <div>
          {/* Book tabs */}
          <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #E2E8F0", marginBottom: 24 }}>
            {Object.entries(dataSource).map(([key, b]) => {
              const isActive = activeBook === key;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveBook(key); setExpandedCh(null); }}
                  style={{
                    padding: "10px 16px", fontSize: 13, fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: `2px solid ${isActive ? bookColor : "transparent"}`,
                    color: isActive ? bookColor : "#64748B",
                    marginBottom: -1,
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Chapter accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {book.chapters.map(ch => {
              const lch = localiseChapter(ch, lang);
              const isOpen = expandedCh === ch.id;
              return (
                <div
                  key={ch.id}
                  style={{
                    background: "#FFFFFF", borderRadius: 12,
                    border: `1px solid ${isOpen ? bookColor + "35" : "#E2E8F0"}`,
                    boxShadow: isOpen ? `0 2px 12px ${bookColor}12` : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    overflow: "hidden",
                  }}
                >
                  {/* Chapter header row */}
                  <div
                    onClick={() => setExpandedCh(isOpen ? null : ch.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 18px", cursor: "pointer", userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                        background: isOpen ? bookColor + "18" : "#F8FAFC",
                        border: `1px solid ${isOpen ? bookColor + "30" : "#E2E8F0"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        color: isOpen ? bookColor : "#94A3B8",
                        transition: "all 0.2s",
                      }}>
                        {String(ch.num).padStart(2, "0")}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isOpen ? "#202124" : "#374151" }}>
                          {lch.title}
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 11, padding: "1px 8px", borderRadius: 4,
                            background: "#F1F5F9", color: "#64748B",
                          }}>
                            {ch.difficulty || "Core"}
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>
                            {ch.keyPoints?.length || 0} key points
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>
                            {ch.formulas?.length || 0} formulas
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      style={{
                        width: 16, height: 16, flexShrink: 0,
                        color: isOpen ? bookColor : "#94A3B8",
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s, color 0.2s",
                      }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  <div style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                    background: "#F8FAFC",
                    borderTop: isOpen ? `1px solid ${bookColor}18` : "1px solid transparent",
                  }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "14px 18px 16px 18px" }}>
                        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>
                          {(lch.overview?.substring?.(0, 200) || "") + (lch.overview?.length > 200 ? "…" : "")}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); nav("curriculum", activeBook, ch); }}
                          style={{
                            padding: "8px 18px",
                            background: bookColor, color: "#fff",
                            border: "none", borderRadius: 7,
                            fontSize: 13, fontWeight: 600,
                            cursor: "pointer",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          Open Chapter →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sticky sidebar */}
        <div style={{ position: "sticky", top: 80 }}>

          {/* AI Tutor card */}
          <div style={{
            background: "#FFFFFF", borderRadius: 16,
            border: `1px solid ${subjectColor}25`,
            overflow: "hidden", marginBottom: 16,
            boxShadow: `0 2px 12px ${subjectColor}10`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}BB)`,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {subjectMeta?.name?.[lang] || "Subject"} AI Tutor
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Powered by Claude</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px", background: "#F8FAFC", minHeight: 80 }}>
              <div style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0",
                borderRadius: 12, borderTopLeftRadius: 4,
                padding: "10px 12px", fontSize: 12, color: "#475569", lineHeight: 1.6,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                maxWidth: "90%",
              }}>
                {aiIntro}
              </div>
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9" }}>
              <button
                onClick={() => nav("chat", undefined, undefined, subject)}
                style={{
                  width: "100%", padding: "9px 0",
                  background: subjectColor + "12",
                  color: subjectColor, border: `1px solid ${subjectColor}25`,
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = subjectColor + "22"}
                onMouseLeave={e => e.currentTarget.style.background = subjectColor + "12"}
              >
                Open AI Chat →
              </button>
            </div>
          </div>

          {/* Quick Resources */}
          <div style={{
            background: "#FFFFFF", borderRadius: 16,
            border: "1px solid #E2E8F0", padding: "18px 16px",
          }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
              Quick Resources
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {(SUBJECT_RESOURCES[subject] || SUBJECT_RESOURCES.mathematics).slice(0, 4).map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      textDecoration: "none",
                      padding: "8px 10px", borderRadius: 8,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 14, marginTop: 1 }}>📄</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{r.desc}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
