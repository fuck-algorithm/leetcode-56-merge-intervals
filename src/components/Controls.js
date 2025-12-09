import React from 'react';
import './Controls.css';

function Controls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onReset,
  mergeCount,
  language
}) {
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  return (
    <div className="controls-container">
      <div className="control-buttons">
        <button
          className="control-button reset-button"
          onClick={onReset}
          title={language === 'zh' ? '重置 (R)' : 'Reset (R)'}
        >
          <span className="button-icon">↺</span>
          <span className="button-text">{language === 'zh' ? '重置' : 'Reset'}</span>
          <span className="button-shortcut">(R)</span>
        </button>

        <button
          className="control-button"
          onClick={onPrevious}
          disabled={isAtStart}
          title={language === 'zh' ? '上一步 (←)' : 'Previous (←)'}
        >
          <span className="button-icon">←</span>
          <span className="button-text">{language === 'zh' ? '上一步' : 'Previous'}</span>
          <span className="button-shortcut">(←)</span>
        </button>

        <button
          className="control-button play-button"
          onClick={onPlayPause}
          title={language === 'zh' ? (isPlaying ? '暂停 (空格)' : '开始 (空格)') : (isPlaying ? 'Pause (Space)' : 'Play (Space)')}
        >
          <span className="button-icon">{isPlaying ? '⏸' : '▶'}</span>
          <span className="button-text">
            {isPlaying 
              ? (language === 'zh' ? '暂停' : 'Pause')
              : (language === 'zh' ? '开始' : 'Play')
            }
          </span>
          <span className="button-shortcut">({language === 'zh' ? '空格' : 'Space'})</span>
        </button>

        <button
          className="control-button"
          onClick={onNext}
          disabled={isAtEnd}
          title={language === 'zh' ? '下一步 (→)' : 'Next (→)'}
        >
          <span className="button-icon">→</span>
          <span className="button-text">{language === 'zh' ? '下一步' : 'Next'}</span>
          <span className="button-shortcut">(→)</span>
        </button>
      </div>

      <div className="progress-info">
        <div className="info-item">
          {language === 'zh' ? '合并后区间数' : 'Merged Intervals'}: {mergeCount}
        </div>
        <div className="info-item">
          {language === 'zh' ? '步骤' : 'Step'}: {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default Controls;
