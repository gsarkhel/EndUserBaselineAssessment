import React, { useState, useEffect } from 'react';
import styles from '../../styles/CircleProgress.scss';

interface CircularProgressBarPropsInterface {
  value?: number;
  enableAnimate?: boolean;
  isPassed?: boolean;
}

const CircularProgressBar = (props: CircularProgressBarPropsInterface) => {
  const { value = 78, enableAnimate = true, isPassed } = props;
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
  const progressColor = isPassed ? '#3ccd57' : '#e37e00'; // Green for pass, orange for fail
  const messageText = isPassed
    ? 'Congratulations! You have passed the assessment!'
    : 'You did not pass the baseline assessment!';
  const messageColor = isPassed ? '#3ccd57' : '#3ccd57';

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressCircleContainer}>
        <svg className={styles.progressCircle} width="200" height="200" viewBox="0 0 200 200">
          {/* White circle background - adjusted to match exact size */}
          <circle cx="100" cy="100" r="62" fill="white" stroke="none" />

          {/* Faded gray track */}
          <circle
            className={styles.progressBg}
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="16"
            fill="transparent"
            stroke="#2a2a2a"
          />

          {/* Green progress bar */}
          <circle
            className={styles.progressBar}
            cx="100"
            cy="100"
            r={radius}
            strokeWidth="16"
            fill="transparent"
            stroke={progressColor}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          />

          <foreignObject x="0" y="0" width="200" height="200">
            <div className={styles.textContainer}>
              <span
                className={styles.percentageText}
                style={{ color: progressColor }}
              >
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
