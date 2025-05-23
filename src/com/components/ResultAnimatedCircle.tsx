import React, { useState, useEffect } from 'react';
import styles from '../styles/ResultAnimatedCircle.scss';
import globalStore from '../thunk';

const CircularProgressBar = ({ value = 78 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { valuesObj } = globalStore.useStoreState((store) => store.player);

  useEffect(() => {
    let startTime: number | null = null;
    const animationDuration = 1000; // 0.2 seconds

    const animateProgress = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      if (elapsed < animationDuration) {
        const progress = elapsed / animationDuration;
        const currentValue = Math.min(progress * value, value);
        setAnimatedValue(currentValue);
        requestAnimationFrame(animateProgress);
      } else {
        setAnimatedValue(value);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [value]);

  // Calculate the circle's circumference
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset based on the animated progress value
  const progress = animatedValue > 100 ? 100 : animatedValue < 0 ? 0 : animatedValue;
  const dashOffset = circumference - (progress / 100) * circumference;
  
  // Determine color based on the threshold (65%)
  const isPassed = progress >= valuesObj.generalConfig.passingCriteria;
  const progressColor = isPassed ? '#3ccd57' : '#e37e00';
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressCircleContainer}>
        <svg className={styles.progressCircle} width="150" height="150" viewBox="0 0 200 200">
          <circle 
            className={styles.progressBg}
            cx="100" 
            cy="100" 
            r={radius} 
            strokeWidth="20"
            fill="transparent"
          />
          <circle 
            className={styles.progressBar}
            cx="100" 
            cy="100" 
            r={radius} 
            strokeWidth="20"
            fill="transparent"
            stroke={progressColor}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
          <foreignObject x="0" y="0" width="200" height="200">
            <div className={styles.textContainer}>
              <span className={styles.percentageText}>{Math.round(progress)}%</span>
            </div>
          </foreignObject>
        </svg>
      </div>
      {/* <div className={styles.resultMessage} style={{ color: progressColor }}>
        {isPassed 
          ? "Congratulations! You have passed the assessment!" 
          : "You did not pass the baseline assessment!"}
      </div> */}
    </div>
  );
};

export default CircularProgressBar;