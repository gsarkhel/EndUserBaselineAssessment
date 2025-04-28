import React, { useState, useEffect } from 'react';
import styles from '../styles/ResultProgressCircle.scss';
import '../../../public/common/assets/fonts/fonts.css';

interface ScoreIndicatorProps {
  score: number;
  isPassed: boolean;
}

const ResultProgressCircle: React.FC<ScoreIndicatorProps> = ({ score, isPassed }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animationDuration = 1000; // 0.3 seconds

    const animateScore = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      if (elapsed < animationDuration) {
        const progress = elapsed / animationDuration;
        const currentScore = Math.min(progress * score, score);
        setAnimatedScore(currentScore);
        requestAnimationFrame(animateScore);
      } else {
        setAnimatedScore(score);
      }
    };

    requestAnimationFrame(animateScore);
  }, [score]);

  const roundedScore = Math.round(animatedScore);

  // Calculate the circumference of the circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate the filled portion based on animated score percentage
  const fillPercentage = animatedScore;
  const fillOffset = circumference - (circumference * fillPercentage) / 100;

  // Determine color based on score threshold
  const progressColor = isPassed ? '#FF9500' : '#4ADE80';

  return (
    <div className={styles.scoreContainer}>
      <h2 className={styles.scoreTitle}>Your Overall Score</h2>
      <div className={styles.scoreChartContainer}>
        {/* SVG for circular progress */}
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background circle (gray track) */}
          <circle cx="60" cy="60" r={radius} stroke="#444444" strokeWidth="10" fill="none" />
          {/* Foreground circle (progress) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={progressColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            strokeDasharray={circumference}
            strokeDashoffset={fillOffset}
          />
        </svg>
        {/* Score text in the center */}
        <div className={styles.scoreText}>{roundedScore}%</div>
      </div>
    </div>
  );
};

export default ResultProgressCircle;

