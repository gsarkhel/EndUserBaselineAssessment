import React, { useState, useEffect } from 'react';
import styles from '../../styles/CircularProgress.scss';

interface circularProgressBarPropsInterface {
  value?: number;
  enableAnimate?: boolean;
}

const CircularProgressBar = (props: circularProgressBarPropsInterface) => {
  const { value = 78, enableAnimate = true } = props;
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (enableAnimate) {
      let startTime: number | null = null;
      const animationDuration = 200; // 0.2 seconds

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
    } else {
      setAnimatedValue(value);
    }
  }, [value, enableAnimate]);

  // Calculate the circle's circumference
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke dash offset based on the animated progress value
  const progress = animatedValue > 100 ? 100 : animatedValue < 0 ? 0 : animatedValue;
  const dashOffset = circumference - (progress / 100) * circumference;

  // Determine color and message based on the threshold (65%)
  const isPassed = progress > 65;
  const progressColor = isPassed ? '#3ccd57' : '#e37e00';
  const messageText = isPassed 
    ? 'Congratulations! You have passed the assessment!' 
    : 'You did not pass the baseline assessment!';
  const messageColor = '#3ccd57'; 

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressCircleContainer}>
        <svg className={styles.progressCircle} width="200" height="200" viewBox="0 0 200 200">
          <circle className={styles.progressBg} cx="100" cy="100" r={radius} strokeWidth="20" fill="transparent" />
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
              <span className={styles.percentageText} style={{ color: isPassed ? '#3ccd57' : '#e37e00' }}>
                {Math.round(progress)}%
              </span>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div className={styles.resultMessage} style={{ color: messageColor }}>
        {messageText}
      </div>
    </div>
  );
};

export default CircularProgressBar;