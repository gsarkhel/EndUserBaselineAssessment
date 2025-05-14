import React from "react";
import styles from "../../styles/AssessmentFooter.scss";
import { t } from "../../helpers/LanguageTranslator";

interface AssessmentFooterProps {
  contactEmail?: string;
  overallScore: number;
}

const AssessmentFooter = (props: AssessmentFooterProps) => {
  const {
    contactEmail = "commercial.excellence.academy@se.com",
    overallScore,
  } = props;
  return (
    <div className={styles.footerContainer}>
      {overallScore > 65 ? (
        <>
          <p className={styles.footerText}>{t("feedback_1_1")}</p>
          <p className={styles.footerText}>{t("feedback_1_2")}</p>
        </>
      ) : (
        <>
          <p className={styles.footerText}>{t("feedback_2_1")}</p>
          <p className={styles.footerText}>{t("feedback_2_2")}</p>
        </>
      )}

      <p className={styles.contactInfo}>
        {t("feedbackEmail").replaceAll("{{email}}", contactEmail)}
      </p>
    </div>
  );
};

export default AssessmentFooter;
