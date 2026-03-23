// Shared styles for home views
// ============================================================
// STYLES
// ============================================================
export const styles = {
  root: {
    minHeight: "100vh",
    background: "#f8f9fa",
    color: "#202124",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgDecor: {
    display: "none",
  },
  bgGrid: {
    display: "none",
  },
  header: {
    position: "sticky", top: 0, zIndex: 100,
    background: "#fff",
    borderBottom: "1px solid #dadce0",
  },
  headerInner: {
    maxWidth: 1080, margin: "0 auto", padding: "12px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    flexWrap: "wrap",
  },
  logoBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 12, padding: 0,
  },
  logoSymbol: {
    fontSize: 28, fontWeight: 900, color: "#1a73e8",
    background: "#e8f0fe", width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8, border: "1px solid #aecbfa",
  },
  logoTitle: { fontSize: 16, fontWeight: 700, color: "#202124", letterSpacing: 0.5 },
  logoSub: { fontSize: 11, color: "#5f6368", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" },
  subjectBadge: {
    padding: "6px 14px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    marginLeft: 8,
  },
  subjectCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    border: "2px solid #e0e0e0",
    transition: "all 0.3s ease",
  },
  headerNav: { display: "flex", gap: 6, flexWrap: "wrap" },
  navBtn: {
    background: "none", border: "1px solid transparent", borderRadius: 8,
    color: "#5f6368", fontSize: 13, padding: "7px 14px", cursor: "pointer",
    transition: "all 0.15s",
    position: "relative",
  },
  navBtnActive: {
    background: "#e8f0fe", borderColor: "transparent",
    color: "#1a73e8",
  },
  navLinkBtn: {
    background: "#e8f0fe", border: "1px solid transparent",
    borderRadius: 8, color: "#1a73e8", fontSize: 13, padding: "7px 14px",
    cursor: "pointer", transition: "all 0.15s",
    textDecoration: "none", display: "inline-block", whiteSpace: "nowrap",
  },
  langToggleBtn: {
    background: "#f1f3f4", border: "1px solid #dadce0",
    borderRadius: 8, color: "#202124", fontSize: 13, padding: "7px 14px",
    cursor: "pointer", transition: "all 0.15s",
    whiteSpace: "nowrap", flexShrink: 0,
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    background: "#1a73e8", color: "#fff", borderRadius: "50%",
    width: 18, height: 18, fontSize: 10, display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  main: { maxWidth: 1080, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 },

  // Home
  homeWrap: { display: "flex", flexDirection: "column", gap: 48 },
  heroSection: { textAlign: "center", padding: "48px 24px" },
  heroTag: {
    display: "inline-block", padding: "6px 16px",
    border: "1px solid #aecbfa", borderRadius: 20,
    color: "#1a73e8", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24,
  },
  heroTitle: { fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, color: "#202124", margin: "0 0 16px", lineHeight: 1.2 },
  heroAccent: { color: "#1a73e8" },
  heroDesc: { fontSize: 17, color: "#5f6368", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  booksGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 },
  bookCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 24, cursor: "pointer",
    transition: "all 0.2s",
  },
  bookIcon: { fontSize: 40, marginBottom: 8 },
  bookKey: { fontSize: 24, fontWeight: 700, color: "#202124" },
  bookTitle: { fontSize: 14, color: "#5f6368", marginTop: 4 },
  bookChapters: { fontSize: 13, color: "#80868b", marginTop: 8 },

  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  featureCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 20,
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: 600, color: "#202124", marginBottom: 8 },
  featureDesc: { fontSize: 13, color: "#5f6368", lineHeight: 1.6 },

  // Page
  pageWrap: { display: "flex", flexDirection: "column", gap: 24 },
  pageTitle: { fontSize: 28, fontWeight: 700, color: "#202124", margin: 0 },
  pageDesc: { color: "#5f6368", fontSize: 15, margin: 0, lineHeight: 1.6 },
  backBtn: {
    background: "none", border: "1px solid #dadce0", color: "#5f6368",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, width: "fit-content",
  },

  // Curriculum
  bookTabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  bookTab: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#5f6368", padding: "10px 20px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, display: "flex", alignItems: "center", gap: 8,
  },
  bookTabActive: { background: "#e8f0fe", borderColor: "#1a73e8", color: "#1a73e8" },

  chapterList: { display: "flex", flexDirection: "column", gap: 12 },
  chapterCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16,
    cursor: "pointer", transition: "all 0.2s",
  },
  chNum: {
    width: 40, height: 40, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700,
    color: "#fff", flexShrink: 0,
  },
  chInfo: { flex: 1 },
  chTitle: { fontSize: 16, fontWeight: 600, color: "#202124" },
  chOverview: { fontSize: 13, color: "#5f6368", marginTop: 4, lineHeight: 1.5 },
  chMeta: { display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" },
  diffBadge: { fontSize: 11, padding: "3px 8px", borderRadius: 4, color: "#202124", background: "transparent" },
  chMetaText: { fontSize: 12, color: "#80868b" },
  chArrow: { color: "#dadce0", fontSize: 20 },

  // Chapter
  chapterHeader: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 28,
  },
  chapterBookBadge: {
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    fontSize: 12, color: "#fff", marginBottom: 12, fontFamily: "sans-serif",
  },
  chapterTitle: { fontSize: 26, fontWeight: 700, color: "#202124", margin: "0 0 12px" },
  chapterOverview: { color: "#5f6368", lineHeight: 1.7, margin: 0, fontSize: 15 },

  tabBar: { display: "flex", gap: 8, borderBottom: "1px solid #dadce0", paddingBottom: 0 },
  tab: {
    background: "none", border: "none", color: "#5f6368",
    padding: "10px 16px", cursor: "pointer", fontSize: 14,
    borderBottom: "2px solid transparent",
  },
  tabActive: { borderBottom: "2px solid #1a73e8", color: "#1a73e8" },

  // Learn
  learnContent: { display: "flex", flexDirection: "column", gap: 32 },
  learnSection: {},
  sectionHeader: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
  },
  sectionIconBox: {
    width: 32, height: 32, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
  },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#202124", margin: 0 },
  keyPointsList: {
    listStyle: "none", padding: 0, margin: 0,
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10,
  },
  formulasGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  formulaCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "14px 16px", position: "relative", overflow: "hidden",
  },
  formulaName: { fontSize: 11, color: "#80868b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 },
  formulaExpr: {
    fontSize: 14,
    background: "#f8f9fa", padding: "10px 14px",
    borderRadius: 6, border: "1px solid #dadce0", lineHeight: 1.8,
    overflowX: "auto",
  },
  hardPointBox: {
    background: "#fef7e0", border: "1px solid #fdd663",
    borderRadius: 8, padding: 16, display: "flex", gap: 14, alignItems: "flex-start",
  },
  hardIcon: {
    width: 28, height: 28, background: "#f9ab00", borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  hardText: { color: "#5f6368", lineHeight: 1.7, margin: 0, fontSize: 13 },

  // Videos
  videoIntro: { color: "#5f6368", fontSize: 14, marginBottom: 4 },
  videoCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 18, display: "flex", gap: 16, alignItems: "center",
    cursor: "pointer", textDecoration: "none", marginBottom: 12,
    transition: "all 0.2s",
  },
  videoThumb: {
    width: 60, height: 44, background: "#1a73e8", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, color: "#fff", flexShrink: 0,
  },
  videoInfo: {},
  videoTitle: { fontSize: 15, fontWeight: 600, color: "#202124" },
  videoChannel: { fontSize: 13, color: "#5f6368", marginTop: 3 },
  videoHint: { fontSize: 12, color: "#1a73e8", marginTop: 6 },
  videoCardAlt: {
    display: "block", textAlign: "center", padding: 14,
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 8, color: "#1a73e8", textDecoration: "none", fontSize: 14,
  },

  // Quiz/Exam Setup
  setupPanel: {
    width: "100%", maxWidth: 480, margin: "0 auto", background: "#fff",
    border: "1px solid #dadce0", borderRadius: 8, padding: "28px 28px 28px",
    display: "flex", flexDirection: "column", gap: 18,
    boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
  },
  setupTitle: { fontSize: 20, fontWeight: 700, color: "#202124", margin: 0 },
  label: { fontSize: 11, color: "#80868b", marginBottom: -10, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 600 },
  select: {
    background: "#f8f9fa", border: "1px solid #dadce0",
    color: "#202124", padding: "10px 14px", borderRadius: 8, fontSize: 14,
    fontFamily: "inherit", width: "100%", outline: "none",
  },
  diffRow: { display: "flex", gap: 8 },
  diffBtn: {
    flex: 1, background: "#f8f9fa", border: "1px solid #dadce0",
    color: "#5f6368", padding: "11px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontWeight: 500, transition: "all 0.15s",
  },
  diffBtnActive: { background: "#e8f0fe", borderColor: "#aecbfa", color: "#1a73e8", fontWeight: 600 },
  examInfo: {
    display: "flex", gap: 20, justifyContent: "center",
    color: "#5f6368", fontSize: 12, flexWrap: "wrap",
    padding: "10px 0", borderTop: "1px solid #dadce0",
  },

  // Quiz Panel
  quizPanel: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 },
  quizProgress: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingBottom: 14, borderBottom: "1px solid #dadce0",
    flexWrap: "wrap", gap: 8,
  },
  diffTag: {
    padding: "4px 12px", borderRadius: 20, color: "#fff",
    fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
  },
  questionBox: {
    background: "#f8f9fa", border: "1px solid #dadce0",
    borderRadius: 8, padding: "22px 26px",
  },
  questionText: { fontSize: 16, color: "#202124", lineHeight: 1.85 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: 8 },
  optionBtn: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#202124", padding: "13px 16px", borderRadius: 8, cursor: "pointer",
    fontSize: 14, textAlign: "left", display: "flex", alignItems: "center", gap: 12,
    transition: "all 0.15s",
  },
  optionSelected: { background: "#e8f0fe", borderColor: "#1a73e8", color: "#1a73e8", boxShadow: "0 0 0 1px rgba(26,115,232,0.2)" },
  optionCorrect: { background: "rgba(22,163,74,0.07)", borderColor: "#16A34A", color: "#15803D" },
  optionWrong: { background: "rgba(217,48,37,0.06)", borderColor: "#d93025", color: "#c5221f" },
  optionLetter: {
    width: 26, height: 26, background: "#f1f3f4", borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0, color: "#5f6368",
    letterSpacing: 0.3,
  },
  feedbackBox: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 0, display: "flex", flexDirection: "column", gap: 0,
    overflow: "hidden",
  },
  feedbackHeader: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "16px 20px", borderBottom: "1px solid #dadce0",
  },
  feedbackSolution: { fontSize: 14, color: "#202124", lineHeight: 1.6 },
  feedbackConcept: { fontSize: 13, color: "#5f6368" },

  // Rich explanation styles
  explanationBlock: {
    padding: "14px 20px",
    borderBottom: "1px solid #f1f3f4",
  },
  explanationLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#80868b", marginBottom: 8,
  },
  formulaHighlight: {
    fontFamily: "monospace", fontSize: 15, color: "#1967d2",
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 6, padding: "10px 14px", lineHeight: 1.6,
  },
  solutionSteps: {
    fontSize: 14, color: "#1a73e8", lineHeight: 1.8,
    background: "#e8f0fe", borderRadius: 6,
    padding: "10px 14px", fontFamily: "monospace",
  },
  deepExplain: {
    fontSize: 14, color: "#202124", lineHeight: 1.85,
  },
  wrongOptionsGrid: {
    display: "flex", flexDirection: "column", gap: 8,
  },
  wrongOptionRow: {
    display: "flex", alignItems: "flex-start", gap: 10,
  },
  wrongLetter: {
    flexShrink: 0, width: 26, height: 26, borderRadius: 6,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#202124",
  },
  wrongReason: {
    fontSize: 13, color: "#5f6368", lineHeight: 1.6, paddingTop: 4,
  },

  // Result panel (Quiz)
  resultPanel: {
    maxWidth: 420, margin: "20px auto", textAlign: "center",
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "44px 40px", boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
  },
  resultScore: { fontSize: 72, fontWeight: 700, color: "#1a73e8", lineHeight: 1, letterSpacing: -2 },
  resultLabel: { fontSize: 14, color: "#80868b", marginBottom: 14, marginTop: 6 },
  resultGrade: { fontSize: 18, color: "#202124", fontWeight: 600, marginBottom: 28, padding: "10px 20px", background: "#f8f9fa", borderRadius: 8, display: "inline-block" },
  resultBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  // Exam
  examPanel: { display: "flex", flexDirection: "column", gap: 20 },
  examHeader: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "14px 20px", display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 12,
  },
  examTitle: { fontSize: 15, fontWeight: 700, color: "#202124" },
  examSubtitle: { fontSize: 12, color: "#80868b", marginTop: 2 },
  timer: {
    fontSize: 22, fontWeight: 700, color: "#1a73e8",
    background: "#e8f0fe", padding: "6px 16px", borderRadius: 8,
    fontFamily: "monospace", letterSpacing: 1,
  },
  timerUrgent: { color: "#d93025", background: "#fce8e6", animation: "pulse 1s infinite" },
  examProgress: { fontSize: 13, color: "#5f6368" },
  examInstructions: {
    background: "#e8f0fe", border: "1px solid #aecbfa",
    borderRadius: 8, padding: 12, fontSize: 13, color: "#1a73e8",
  },
  examQuestions: { display: "flex", flexDirection: "column", gap: 20 },
  examQuestion: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: "20px 24px",
  },
  examQHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  examQNum: {
    background: "#202124", color: "#fff",
    padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
  },
  examQMarks: {
    color: "#5f6368", fontSize: 11, fontWeight: 600,
    background: "#f1f3f4", padding: "3px 10px", borderRadius: 20,
  },
  examQText: { fontSize: 15, color: "#202124", lineHeight: 1.75, marginBottom: 14 },
  examOptions: { display: "flex", flexDirection: "column", gap: 8 },

  // Results (Exam)
  resultsPanel: { display: "flex", flexDirection: "column", gap: 24 },
  resultsHeader: {
    textAlign: "center", background: "#1a73e8",
    borderRadius: 8, padding: "40px 36px", color: "#fff",
  },
  resultsGrade: { fontSize: 80, fontWeight: 700, color: "#fff", lineHeight: 1 },
  resultsScore: { fontSize: 22, color: "rgba(255,255,255,0.7)", marginTop: 10 },
  resultsLabel: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 8 },
  umsScore: { fontSize: 15, color: "#fff", marginTop: 12 },
  gradeBands: { display: "flex", gap: 8, flexWrap: "wrap" },
  gradeBand: {
    padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center",
    gap: 8, fontSize: 13,
  },
  gradeBandLabel: { fontWeight: 700, color: "#202124" },
  gradeBandPct: { color: "#5f6368" },
  gradeBandCheck: { color: "#188038" },
  reviewTitle: { fontSize: 18, fontWeight: 700, color: "#202124", margin: "0 0 4px" },
  reviewList: { display: "flex", flexDirection: "column", gap: 14 },
  reviewItem: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 18,
  },
  reviewHeader: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5f6368", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  reviewQuestion: { fontSize: 15, color: "#202124", lineHeight: 1.6, marginBottom: 10 },
  reviewSolution: { fontSize: 13, color: "#5f6368", lineHeight: 1.6, background: "#f8f9fa", padding: 12, borderRadius: 6 },
  reviewTopic: { fontSize: 12, color: "#80868b", marginTop: 6 },
  aiExplanation: {
    fontSize: 13, color: "#1967d2", marginTop: 10, padding: 10,
    background: "#e8f0fe", borderRadius: 6,
  },

  // Mock exam papers
  papersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  paperCard: {
    background: "#fff", border: "1px solid #dadce0",
    borderRadius: 8, padding: 22, display: "flex", flexDirection: "column", gap: 8,
    textAlign: "center",
  },
  paperYear: { fontSize: 28, fontWeight: 700, color: "#202124" },
  paperSession: { fontSize: 13, color: "#5f6368" },
  paperPaper: { fontSize: 18, color: "#1a73e8", fontWeight: 600 },
  paperMeta: { display: "flex", justifyContent: "center", gap: 14, color: "#5f6368", fontSize: 13, margin: "4px 0" },

  // Error Book
  errorList: { display: "flex", flexDirection: "column", gap: 14 },
  errorCard: {
    background: "#fce8e6", border: "1px solid #fad2cf",
    borderRadius: 8, padding: 18,
  },
  errorCardActive: { borderColor: "#f5bcba", background: "#fce8e6" },
  errorCardHeader: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  errorChapter: { fontSize: 12, color: "#80868b", marginBottom: 6, display: "block" },
  errorQuestion: { fontSize: 15, color: "#202124", lineHeight: 1.5 },
  errorCardBtns: { display: "flex", gap: 8, flexShrink: 0 },
  errorAnswers: { display: "flex", gap: 16, marginTop: 12, fontSize: 13, flexWrap: "wrap" },
  errorWrong: { color: "#d93025" },
  errorCorrect: { color: "#188038" },
  explanationBox: {
    marginTop: 14, background: "#f8f9fa", borderRadius: 8,
    padding: 16, borderLeft: "3px solid #1a73e8",
  },
  explanationText: { color: "#202124", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  errorCount: { fontSize: 16, color: "#d93025", fontWeight: 400, marginLeft: 10 },
  emptyState: { textAlign: "center", padding: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 20, color: "#202124" },
  emptyDesc: { color: "#5f6368", fontSize: 15, maxWidth: 340 },

  // Buttons
  btnPrimary: {
    background: "#1a73e8",
    border: "none", color: "#FFFFFF",
    padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: "pointer", transition: "all 0.15s",
    alignSelf: "flex-start",
  },
  btnSecondary: {
    background: "#fff", border: "1px solid #dadce0",
    color: "#202124", padding: "11px 22px", borderRadius: 8, fontSize: 14,
    cursor: "pointer",
  },
  btnSmall: {
    background: "#e8f0fe", border: "1px solid #aecbfa",
    color: "#1a73e8", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer",
  },
  btnSmallDanger: {
    background: "#fce8e6", border: "1px solid #fad2cf",
    color: "#d93025", padding: "6px 12px", borderRadius: 6, fontSize: 12,
    cursor: "pointer",
  },

  // Loading
  loading: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #d2e3fc",
    borderTop: "3px solid #1a73e8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingMsg: { color: "#5f6368", fontSize: 14 },
};

// Inject keyframe animations
const styleEl = document.createElement("style");
styleEl.innerHTML = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
*{box-sizing:border-box;}
button:hover{opacity:0.88;}
a:hover{opacity:0.85;}
`;
document.head.appendChild(styleEl);
