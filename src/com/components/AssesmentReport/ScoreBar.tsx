import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/ScoreBar.scss';

interface ScoreBarProps {
  label: string;
  score: number;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  const barColor = score >= 65 ? 'bg-success' : 'bg-warning';
  
  return (
    <div className="mb-3 w-100">
      <div className="d-flex justify-content-between mb-1">
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreValue}>{score}%</span>
      </div>
      <div className="progress" style={{ height: '20px' }}>
        <div 
          className={`progress-bar ${barColor}`} 
          role="progressbar" 
          style={{ width: `${score}%` }}
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBar;