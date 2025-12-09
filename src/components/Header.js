import React from 'react';
import './Header.css';

function Header({ language, setLanguage, speechEnabled, onSpeechToggle, speechSupported }) {
  return (
    <header className="header">
      <div className="header-left">
        <a href="https://fuck-algorithm.github.io/leetcode-hot-100/" className="nav-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0L0 8l8 8 8-8L8 0zm0 2.5L13.5 8 8 13.5 2.5 8 8 2.5z"/>
          </svg>
          {language === 'zh' ? '返回 Hot 100' : 'Back to Hot 100'}
        </a>
        <a href="https://github.com/fuck-algorithm/leetcode-56-merge-intervals" className="nav-link">
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          {language === 'zh' ? '查看源代码' : 'View Source'}
        </a>
      </div>
      
      <div className="header-right">
        {speechSupported && (
          <button 
            className={`speech-toggle ${speechEnabled ? 'enabled' : ''}`}
            onClick={onSpeechToggle}
            title={language === 'zh' ? (speechEnabled ? '关闭语音播报' : '开启语音播报') : (speechEnabled ? 'Disable Speech' : 'Enable Speech')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {speechEnabled ? (
                // Speaker on icon
                <>
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </>
              ) : (
                // Speaker off icon
                <>
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </>
              )}
            </svg>
            <span className="speech-label">
              {language === 'zh' ? (speechEnabled ? '语音' : '语音') : (speechEnabled ? 'Speech' : 'Speech')}
            </span>
          </button>
        )}
        <select 
          className="language-select" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English (英文)</option>
          <option value="zh">中文</option>
        </select>
        <a 
          href="https://github.com/fuck-algorithm/leetcode-56-merge-intervals" 
          className="github-icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
    </header>
  );
}

export default Header;
