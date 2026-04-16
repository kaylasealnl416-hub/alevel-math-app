import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
// ChatPage 已移除
import PracticeView from "./components/practice/PracticeView";
import { T } from "./utils/translations.js";
import { styles } from "./styles/homeStyles.js";
import SubjectsView from "./components/home/SubjectsView.jsx";
import CurriculumView from "./components/home/CurriculumView.jsx";
import ChapterView from "./components/home/ChapterView.jsx";
import ExamView from "./components/home/ExamView.jsx";
import MockExamView from "./components/home/MockExamView.jsx";
export default function ALevelMathApp() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [lang] = useState("en");

  useEffect(() => {
    if (isAuthenticated) {
      const pendingView = sessionStorage.getItem('pendingView');
      if (pendingView) {
        sessionStorage.removeItem('pendingView');
        nav(pendingView, undefined, pendingView === "curriculum" ? null : undefined, selectedSubject);
      }
    }
  }, [isAuthenticated]);

  const t = T[lang];

  const nav = (view, book = undefined, chapter = undefined, subject = undefined) => {
    setActiveView(view);
    if (subject !== undefined) setSelectedSubject(subject);
    if (book !== undefined) setSelectedBook(book);
    if (chapter !== undefined) setSelectedChapter(chapter);
    window.scrollTo(0, 0);
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgDecor} />
      <div style={styles.bgGrid} />

      <main style={(activeView === "subjects" || (activeView === "curriculum" && !selectedChapter) || activeView === "chat") ? { position: "relative", zIndex: 1 } : styles.main}>
        {activeView === "subjects" && <SubjectsView nav={nav} lang={lang} selectedSubject={selectedSubject} />}
        {activeView === "curriculum" && !selectedChapter && <CurriculumView key={selectedSubject} nav={nav} t={t} lang={lang} subject={selectedSubject} book={selectedBook} />}
        {activeView === "curriculum" && selectedChapter && (
          <ChapterView key={`${selectedSubject}-${selectedBook}`} chapter={selectedChapter} book={selectedBook} nav={nav} t={t} lang={lang} subject={selectedSubject} />
        )}
        {activeView === "quiz" && (
          <PracticeView
            chapter={selectedChapter}
            book={selectedBook}
            subject={selectedSubject}
            onBack={() => nav.goTo("curriculum")}
          />
        )}
        {activeView === "exam" && (
          <ExamView
            chapter={selectedChapter}
            book={selectedBook}
            nav={nav}
            t={t}
            lang={lang}
            subject={selectedSubject}
          />
        )}
        {activeView === "mock" && (
          <MockExamView
            nav={nav}
            t={t}
            lang={lang}
            subject={selectedSubject}
          />
        )}
        {/* chat 视图已移除 */}
      </main>
    </div>
  );
}
