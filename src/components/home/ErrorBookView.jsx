import { useState } from "react";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";
import { callAI } from "../../utils/callAI.js";

function LoadingSpinner({ message }) {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <div style={styles.loadingMsg}>{message}</div>
    </div>
  );
}

export default function ErrorBookView({ errors, onClear, nav, t, lang, subject = "mathematics" }) {
  const [selectedError, setSelectedError] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loadingExp, setLoadingExp] = useState(false);

  const subjectName = {
    mathematics: "Mathematics",
    economics: "Economics",
    history: "History",
    politics: "Politics",
    psychology: "Psychology",
    further_math: "Further Mathematics"
  }[subject] || "A-Level";

  const getAIExplanation = async (err) => {
    setSelectedError(err);
    setLoadingExp(true);
    setExplanation("");
    const text = await callAI(
      `You are an A-Level ${subjectName} tutor. Explain the concept clearly and concisely for a student who got this wrong.$""`,
      `Student got this wrong:\nQuestion: ${err.question}\nTheir answer: ${err.userAnswer}\nCorrect answer: ${err.correct}\nSolution: ${err.solution}\n\nProvide: 1) Where they went wrong, 2) The key concept, 3) A tip to remember it`
    );
    setExplanation(text);
    setLoadingExp(false);
  };

  if (errors.length === 0) {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.errorNotebook}</h2>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📗</div>
          <div style={styles.emptyText}>{t.emptyNotebook}</div>
          <div style={styles.emptyDesc}>{t.emptyDesc}</div>
          <button onClick={() => nav("quiz")} style={styles.btnPrimary}>{t.takeQuizBtn}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrap}>
      <h2 style={styles.pageTitle}>{t.errorNotebook} <span style={styles.errorCount}>{errors.length} {t.questionsLabel}</span></h2>
      <p style={styles.pageDesc}>{t.reviewMistakesDesc}</p>
      <div style={styles.errorList}>
        {errors.map((err, i) => (
          <div key={err.id || i} style={{ ...styles.errorCard, ...(selectedError?.id === err.id ? styles.errorCardActive : {}) }}>
            <div style={styles.errorCardHeader}>
              <div>
                <span style={styles.errorChapter}>{err.chapter || "General"} · {err.book || ""}</span>
                <div style={styles.errorQuestion}><MathText text={err.question} /></div>
              </div>
              <div style={styles.errorCardBtns}>
                <button onClick={() => getAIExplanation(err)} style={styles.btnSmall}>{t.aiExplainBtn}</button>
                <button onClick={() => onClear(err.id)} style={styles.btnSmallDanger}>{t.removeBtn}</button>
              </div>
            </div>
            <div style={styles.errorAnswers}>
              <span style={styles.errorWrong}>{t.yourAnswerLabel} {err.userAnswer || t.noAnswer}</span>
              <span style={styles.errorCorrect}><MathText text={t.correctLabel + " " + err.correct} /></span>
            </div>
            {selectedError?.id === err.id && (
              <div style={styles.explanationBox}>
                {loadingExp ? <LoadingSpinner message={t.aiExplainingMsg} /> : (
                  <div style={styles.explanationText}>{explanation}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
