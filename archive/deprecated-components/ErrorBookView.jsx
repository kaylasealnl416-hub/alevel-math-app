import { useState } from "react";
import { styles } from "../../styles/homeStyles.js";
import MathText from "../practice/MathText";

export default function ErrorBookView({ errors, onClear, nav, t, lang, subject = "mathematics" }) {
  const [selectedError, setSelectedError] = useState(null);

  // 点击查看解析：直接显示题目自带的 solution，不调 AI
  const showSolution = (err) => {
    setSelectedError(selectedError?.id === err.id ? null : err);
  };

  if (errors.length === 0) {
    return (
      <div style={styles.pageWrap}>
        <h2 style={styles.pageTitle}>{t.errorNotebook}</h2>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📗</div>
          <div style={styles.emptyText}>{t.emptyNotebook}</div>
          <div style={styles.emptyDesc}>{t.emptyDesc}</div>
          <button onClick={() => nav("curriculum")} style={styles.btnPrimary}>{t.takeQuizBtn}</button>
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
                <button onClick={() => showSolution(err)} style={styles.btnSmall}>
                  {selectedError?.id === err.id ? t.hideSolution || "Hide" : t.viewSolution || "Solution"}
                </button>
                <button onClick={() => onClear(err.id)} style={styles.btnSmallDanger}>{t.removeBtn}</button>
              </div>
            </div>
            <div style={styles.errorAnswers}>
              <span style={styles.errorWrong}>{t.yourAnswerLabel} {err.userAnswer || t.noAnswer}</span>
              <span style={styles.errorCorrect}><MathText text={t.correctLabel + " " + err.correct} /></span>
            </div>
            {selectedError?.id === err.id && (
              <div style={styles.explanationBox}>
                <div style={styles.explanationText}>
                  <MathText text={err.solution || "No solution available."} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
