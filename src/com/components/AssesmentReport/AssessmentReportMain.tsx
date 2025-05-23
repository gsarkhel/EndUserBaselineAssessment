import React, { useEffect, useState } from "react";
import Header from "./Header";
import CircleProgressBar from "./CircleProgressBar";
import SectionScores from "./SectionScores";
import AssessmentFooter from "./AssessmentFooter";
import styles from "../../styles/AssessmentReport.scss";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import globalStore from "../../thunk";
import "../../../../public/common/assets/fonts/fonts.css";
import {
  ActivityDataStoreModel,
  PlayerStoreModel,
} from "../../interface/storeInterface";
import { t } from "../../helpers/LanguageTranslator";

interface AssessmentData {
  overallScore: number;
  sectionScores: {
    label: string;
    score: number;
  }[];
  passingScore: {
    overall: number;
  };
}

interface assessmentDataProps {
  data?: AssessmentData;
  images?: PlayerStoreModel["images"];
  isPassed?: boolean;
}

const AssessmentReport = (props: assessmentDataProps) => {
  const { data: assessmentData, images, isPassed } = props;

  const [height, setHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const _h = document.getElementsByClassName(styles.innerCont)[0]
        ?.clientHeight;
      setHeight(_h + 10);
    }, 200);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={styles.reportContainer}>
        <div
          className={styles.reportCard}
          style={{
            width: "764px",
            height: "980px",
            padding: "0 40px",
            backgroundImage: images.certificateBG?.url
              ? `url(${images.certificateBG.url})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <div className={styles.pdflogo}>
            <img src={images.pdflogo?.url} alt={""} />
          </div>

          <h3 className={styles.headingtop}>{t("pdfHeaderText")}</h3>
          <div className={styles.backDiv} style={{ height: height }}></div>
          <div className={styles.innerCont}>
            <Header title={t("headerTitle")} />

            <div className="d-flex justify-content-center mt-4 mb-4">
              <CircleProgressBar
                isPassed={isPassed}
                value={assessmentData.overallScore}
                enableAnimate={false}
              />
            </div>

            <SectionScores
              sectionScores={assessmentData.sectionScores}
              passingScore={assessmentData.passingScore}
            />

            <AssessmentFooter overallScore={assessmentData.overallScore} />
          </div>
          <div className={styles.timerContainer}>
            <p>
              {t("generated")}: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReport;
