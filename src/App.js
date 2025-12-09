import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { generateMergeSteps, parseIntervals, formatIntervals, EXAMPLES } from './mergeIntervalsAlgorithm';
import IntervalVisualization from './components/IntervalVisualization';
import Controls from './components/Controls';
import Header from './components/Header';
import speechService from './utils/speechService';

function App() {
  const [intervals, setIntervals] = useState(EXAMPLES.example1.intervals);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [inputValue, setInputValue] = useState(formatIntervals(EXAMPLES.example1.intervals));
  const [language, setLanguage] = useState('zh');
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const playIntervalRef = useRef(null);

  // 初始化语音服务
  useEffect(() => {
    if (speechService.isSupported()) {
      speechService.setEnabled(true);
    }
  }, []);

  // 同步语音速度
  useEffect(() => {
    speechService.setRate(speed);
  }, [speed]);

  // Generate steps when intervals change
  useEffect(() => {
    const newSteps = generateMergeSteps(intervals);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    speechService.stop();
  }, [intervals]);

  // Speech synthesis when step changes
  useEffect(() => {
    if (steps.length > 0 && speechEnabled) {
      const currentStep = steps[currentStepIndex];
      if (currentStep && currentStep.message) {
        // 延迟一点播放，让动画先出现
        setTimeout(() => {
          speechService.speak(currentStep.message, language);
        }, 100);
      }
    }
  }, [currentStepIndex, steps, speechEnabled, language]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      const delay = 1000 / speed;
      playIntervalRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (playIntervalRef.current) {
        clearTimeout(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [currentStepIndex, steps.length, isPlaying]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  }, [currentStepIndex, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  }, [currentStepIndex]);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayPause, handlePrevious, handleNext, handleReset]);

  const handleSpeedChange = (newSpeed) => {
    console.log('设置速度:', newSpeed + 'x');
    setSpeed(newSpeed);
    // 同步语音速度
    speechService.setRate(newSpeed);
  };

  const handleSpeechToggle = () => {
    const newEnabled = !speechEnabled;
    setSpeechEnabled(newEnabled);
    speechService.setEnabled(newEnabled);
    
    if (!newEnabled) {
      speechService.stop();
    }
  };

  const handleApplyInput = () => {
    const parsed = parseIntervals(inputValue);
    if (parsed && parsed.length > 0) {
      setIntervals(parsed);
    } else {
      alert('输入格式错误！请使用格式：[[1,3],[2,6],[8,10]] 或 1,3;2,6;8,10');
    }
  };

  const handleExampleClick = (exampleKey) => {
    const example = EXAMPLES[exampleKey];
    setIntervals(example.intervals);
    setInputValue(formatIntervals(example.intervals));
  };

  const handleRandomExample = () => {
    const count = 3 + Math.floor(Math.random() * 5); // 3-7 intervals
    const randomIntervals = [];
    for (let i = 0; i < count; i++) {
      const start = Math.floor(Math.random() * 20);
      const end = start + 1 + Math.floor(Math.random() * 10);
      randomIntervals.push({ start, end });
    }
    setIntervals(randomIntervals);
    setInputValue(formatIntervals(randomIntervals));
  };

  const currentStep = steps[currentStepIndex] || steps[0];
  const mergeCount = currentStep ? currentStep.mergedIntervals.length : 0;

  return (
    <div className="App">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        speechEnabled={speechEnabled}
        onSpeechToggle={handleSpeechToggle}
        speechSupported={speechService.isSupported()}
      />
      
      <main className="main-content">
        <h1 className="title">
          <a 
            href="https://leetcode.cn/problems/merge-intervals/description/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="title-link"
          >
            <span className="problem-number">#56</span>
            {language === 'zh' ? '合并区间' : 'Merge Intervals'}
          </a>
          <div className="title-badges">
            <span className="difficulty-badge medium">
              {language === 'zh' ? '中等' : 'Medium'}
            </span>
            <span className="topic-tag">
              {language === 'zh' ? '数组' : 'Array'}
            </span>
            <span className="topic-tag">
              {language === 'zh' ? '排序' : 'Sorting'}
            </span>
          </div>
        </h1>

        <div className="control-panel">
          <div className="input-section">
            <input
              type="text"
              className="interval-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={language === 'zh' ? '输入区间，例如：[[1,3],[2,6],[8,10]]' : 'Input intervals, e.g.: [[1,3],[2,6],[8,10]]'}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyInput()}
            />
            <button className="apply-button" onClick={handleApplyInput}>
              {language === 'zh' ? '应用' : 'Apply'}
            </button>
          </div>

          <div className="controls-section">
            <div className="speed-control">
              <label>{language === 'zh' ? '速度' : 'Speed'}: {speed.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              />
            </div>

            <div className="example-buttons">
              <button onClick={() => handleExampleClick('example1')}>
                {language === 'zh' ? '力扣示例1' : 'Example 1'}
              </button>
              <button onClick={() => handleExampleClick('example2')}>
                {language === 'zh' ? '力扣示例2' : 'Example 2'}
              </button>
              <button onClick={() => handleExampleClick('example3')}>
                {language === 'zh' ? '力扣示例3' : 'Example 3'}
              </button>
              <button onClick={() => handleExampleClick('allOverlap')}>
                {language === 'zh' ? '全部重叠' : 'All Overlap'}
              </button>
              <button onClick={() => handleExampleClick('noOverlap')}>
                {language === 'zh' ? '无重叠' : 'No Overlap'}
              </button>
              <button onClick={() => handleExampleClick('complex')}>
                {language === 'zh' ? '复杂情况' : 'Complex'}
              </button>
              <button onClick={handleRandomExample} className="random-button">
                {language === 'zh' ? '随机' : 'Random'}
              </button>
            </div>
          </div>
        </div>

        <IntervalVisualization step={currentStep} language={language} />

        <Controls
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onReset={handleReset}
          mergeCount={mergeCount}
          language={language}
        />
      </main>
    </div>
  );
}

export default App;
