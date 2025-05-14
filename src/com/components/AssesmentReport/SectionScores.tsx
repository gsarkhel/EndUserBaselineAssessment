import React from "react";
import ScoreBar from "./ScoreBar";
import styles from "../../styles/SectionScores.scss";
import globalStore from "../../thunk";
import { t } from "../../helpers/LanguageTranslator";

interface SectionScore {
  label: string;
  score: number;
}

interface SectionScoresProps {
  sectionScores: SectionScore[];
  passingScore?: {
    overall: number;
  };
}

const SectionScores = (props: SectionScoresProps) => {
  const { sectionScores, passingScore } = props;

  const { valuesObj } = globalStore.useStoreState((_st) => _st.player);
  // Helper function to determine bar color based on score
  const getBarColor = (score: number): string => {
    if (score >= valuesObj.generalConfig.passingCriteria) return "#3ccd57"; // Green for high scores
    // if (score >= 60)
    return "#e37e00"; // Amber for medium scores
    return "#F44336"; // Red for low scores
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>{t("sectionScore")}</h1>
      </div>

      <div className={styles.strline}>
        {sectionScores.map((section, index) => (
          <div key={index} className={styles.scoreRow}>
            <div className={styles.label}>{section.label}</div>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${section.score}%`,
                  backgroundColor: getBarColor(section.score),
                }}
              />
              <div className={styles.percentageText}>
                {section.score.toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      {passingScore && (
        <div className={styles.passingScoreNote}>
          {t("passingScore").replaceAll("{{score}}", `${passingScore.overall}`)}
        </div>
      )}
    </div>
  );
};

export default SectionScores;
