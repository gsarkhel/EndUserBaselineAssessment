import React from 'react';
import styles from '../../styles/AssessmentFooter.scss';

interface AssessmentFooterProps {
  contactEmail?: string;
  overallScore: number;
}

const AssessmentFooter: React.FC<AssessmentFooterProps> = ({ 
  contactEmail = "commercial.excellence.academy@se.com" ,
  overallScore
}) => {
  return (
    <div className={styles.footerContainer}>
      {/* <p className={styles.footerText}>
        We have handpicked trainings for you that will help you excel in the
        sections where you scored less than 65%. These trainings will also
        be assigned to you on My LearningLink.
      </p>
      
      <p className={styles.footerText}>
        We highly recommend you to complete these trainings before you
        retake the assessment in order to maximize your chances to pass it.
      </p> */}
      {overallScore > 65 ? (
        <>
          <p className={styles.footerText}>
            Your hard work and dedication have paid off.
          </p>
          <p className={styles.footerText}>
            You have completed a critical milestone in the End User Sellers<b></b>
            Associate Certification. You will receive an email with further<b></b>
            information on next steps.
          </p>
        </>
      ) : (
        <>
          <p  className={styles.footerText }>
            We have handpicked trainings for you that will help you excel in the
            sections where you scored less than 65%. These trainings will also
            be assigned to you on My LearningLink within the next 24 hours.
          </p>
          <p className={styles.footerText}>
            We highly recommend you to complete these trainings before you
            retake the assessment in order to maximize your chances to pass it.
          </p>
        </>
      )}
      
      <p className={styles.contactInfo}>
        If you have any further questions, email us at {contactEmail}
      </p>
    </div>
  );
};

export default AssessmentFooter;