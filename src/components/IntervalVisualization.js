import React, { useEffect, useRef } from 'react';
import './IntervalVisualization.css';

function IntervalVisualization({ step, language }) {
  const svgRef = useRef(null);
  const originalSectionRef = useRef(null);
  const mergedSectionRef = useRef(null);
  
  // 动态绘制箭头连接
  useEffect(() => {
    if (!step) return;
    const { intervals, mergedIntervals, type } = step;
    if (!svgRef.current || !originalSectionRef.current || !mergedSectionRef.current) return;
    if (mergedIntervals.length === 0) return;
    
    const svg = svgRef.current;
    const originalSection = originalSectionRef.current;
    const mergedSection = mergedSectionRef.current;
    
    // 清除旧的箭头
    while (svg.firstChild && svg.firstChild.tagName !== 'defs') {
      svg.removeChild(svg.firstChild);
    }
    
    // 获取所有区间盒子的位置
    const originalBoxes = originalSection.querySelectorAll('.interval-box');
    const mergedBoxes = mergedSection.querySelectorAll('.interval-box');
    
    const svgRect = svg.getBoundingClientRect();
    
    // 为每个合并区间绘制箭头
    mergedBoxes.forEach((mergedBox, mIdx) => {
      const mergedInterval = mergedIntervals[mIdx];
      const isProcessing = mIdx === mergedIntervals.length - 1 && type !== 'complete';
      const mergedRect = mergedBox.getBoundingClientRect();
      
      // 获取合并结果的颜色组，并添加对应的marker
      const colorGroup = getColorForMergedIndex(mIdx);
      const defs = svg.querySelector('defs');
      if (defs && !svg.querySelector(`#arrowhead-${mIdx}`)) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', `arrowhead-${mIdx}`);
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3, 0 6');
        polygon.setAttribute('fill', colorGroup.primary);
        polygon.setAttribute('opacity', '0.8');
        marker.appendChild(polygon);
        defs.appendChild(marker);
      }
      
      originalBoxes.forEach((originalBox, oIdx) => {
        const originalInterval = intervals[oIdx];
        
        // 判断是否被合并
        if (originalInterval.start >= mergedInterval.start && originalInterval.end <= mergedInterval.end) {
          const originalRect = originalBox.getBoundingClientRect();
          
          // 计算箭头起点和终点（相对于SVG）
          const startX = originalRect.left + originalRect.width / 2 - svgRect.left;
          const startY = originalRect.bottom - svgRect.top;
          const endX = mergedRect.left + mergedRect.width / 2 - svgRect.left;
          const endY = mergedRect.top - svgRect.top;
          
          // 计算控制点（贝塞尔曲线）
          const controlY = startY + (endY - startY) * 0.5;
          
          // 创建路径
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;
          path.setAttribute('d', d);
          path.setAttribute('stroke', isProcessing ? '#ffd700' : colorGroup.primary);
          path.setAttribute('stroke-width', '2');
          path.setAttribute('fill', 'none');
          path.setAttribute('opacity', '0.7');
          path.setAttribute('marker-end', `url(#arrowhead-${mIdx})`);
          path.setAttribute('class', `merge-arrow ${isProcessing ? 'processing' : ''}`);
          path.setAttribute('stroke-dasharray', '5,5');
          
          // 添加动画
          const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
          animate.setAttribute('attributeName', 'stroke-dashoffset');
          animate.setAttribute('from', '10');
          animate.setAttribute('to', '0');
          animate.setAttribute('dur', '1s');
          animate.setAttribute('repeatCount', 'indefinite');
          path.appendChild(animate);
          
          svg.appendChild(path);
        }
      });
    });
  }, [step]);

  if (!step) return null;
  
  const { intervals, mergedIntervals, currentIndex, highlightIndices, message, type } = step;

  // 计算区间的最小值和最大值，用于绘制数轴
  const getAllIntervals = [...intervals, ...mergedIntervals];
  const allValues = getAllIntervals.flatMap(i => [i.start, i.end]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue || 1; // 避免除以0
  
  // 智能计算刻度数量，避免过于密集
  const getTickCount = () => {
    if (range <= 10) return range + 1;
    if (range <= 20) return 11;
    if (range <= 50) return 11;
    return 15;
  };
  
  const tickCount = getTickCount();
  const tickStep = range / (tickCount - 1);
  
  // 生成刻度值
  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      const value = Math.round(minValue + i * tickStep);
      if (i === 0 || i === tickCount - 1 || !ticks.some(t => Math.abs(t - value) < tickStep * 0.3)) {
        ticks.push(value);
      }
    }
    return ticks;
  };
  
  const ticks = generateTicks();
  
  // 为区间分配不重叠的轨道（垂直层级）
  const assignTracks = (intervalsList) => {
    if (!intervalsList || intervalsList.length === 0) return [];
    
    // 按起始位置排序
    const sorted = intervalsList.map((interval, idx) => ({
      ...interval,
      originalIndex: idx,
      track: 0
    })).sort((a, b) => a.start - b.start);
    
    // 贪心分配轨道
    const tracks = []; // 每个轨道记录最后一个区间的结束位置
    
    sorted.forEach(interval => {
      // 找到第一个可用的轨道（该轨道最后区间的结束位置 < 当前区间的开始位置）
      let assignedTrack = -1;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i] <= interval.start) {
          assignedTrack = i;
          tracks[i] = interval.end;
          break;
        }
      }
      
      // 如果没有找到可用轨道，创建新轨道
      if (assignedTrack === -1) {
        assignedTrack = tracks.length;
        tracks.push(interval.end);
      }
      
      interval.track = assignedTrack;
    });
    
    // 恢复原始顺序
    return sorted.sort((a, b) => a.originalIndex - b.originalIndex);
  };
  
  const intervalsWithTracks = assignTracks(intervals);
  const mergedIntervalsWithTracks = assignTracks(mergedIntervals);
  
  // 计算需要的轨道数量
  const maxOriginalTrack = intervalsWithTracks.reduce((max, item) => Math.max(max, item.track), 0);
  const maxMergedTrack = mergedIntervalsWithTracks.reduce((max, item) => Math.max(max, item.track), 0);
  
  // 为每个合并结果分配颜色组
  const getColorForMergedIndex = (mergedIndex) => {
    const colors = [
      { primary: '#66bb6a', light: '#81c784', dark: '#4caf50', bg: '#2a3a2a' },      // 绿色
      { primary: '#42a5f5', light: '#64b5f6', dark: '#2196f3', bg: '#2a3a4a' },      // 蓝色
      { primary: '#26c6da', light: '#4dd0e1', dark: '#00bcd4', bg: '#2a3a3a' },      // 青色
      { primary: '#ffa726', light: '#ffb74d', dark: '#ff9800', bg: '#3a3a2a' },      // 橙色
      { primary: '#ec407a', light: '#f06292', dark: '#e91e63', bg: '#3a2a2a' },      // 粉色
      { primary: '#8d6e63', light: '#a1887f', dark: '#6d4c41', bg: '#2a2a2a' },      // 棕色
    ];
    return colors[mergedIndex % colors.length];
  };
  
  // 为每个原始区间分配其所属的合并区间的索引
  const getOriginalIntervalMergedIndex = (interval) => {
    return mergedIntervals.findIndex(merged => 
      interval.start >= merged.start && interval.end <= merged.end
    );
  };

  return (
    <div className="visualization-container">
      {/* Algorithm Explanation */}
      {type === 'initial' && (
        <div className="algorithm-hint">
          <strong>{language === 'zh' ? '💡 算法思路：' : '💡 Algorithm:'}</strong>
          {language === 'zh' 
            ? '先排序，然后依次遍历。用"当前区间"记录正在处理的区间，遇到重叠就合并（扩展右边界），不重叠就保存当前区间并切换到新区间。'
            : 'Sort first, then iterate. Keep a "current interval" being processed. Merge if overlapping (extend right boundary), otherwise save current and switch to new interval.'
          }
        </div>
      )}

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-box legend-normal"></div>
          <span>{language === 'zh' ? '普通区间' : 'Normal'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-highlight"></div>
          <span>{language === 'zh' ? '正在比较' : 'Comparing'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-processing"></div>
          <span>{language === 'zh' ? '当前区间' : 'Current'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-merged"></div>
          <span>{language === 'zh' ? '已合并' : 'Merged'}</span>
        </div>
      </div>
      
      {/* Original/Sorted Intervals */}
      <div className="intervals-section" ref={originalSectionRef}>
        <h3 className="section-title">
          {type === 'initial' 
            ? (language === 'zh' ? '原始区间' : 'Original Intervals')
            : (language === 'zh' ? '排序后的区间' : 'Sorted Intervals')
          }
        </h3>
        <div className="intervals-display">
          {intervals.map((interval, idx) => {
            const isHighlighted = highlightIndices.includes(idx);
            const isCurrent = idx === currentIndex;
            const mergedIndex = getOriginalIntervalMergedIndex(interval);
            const colorGroup = mergedIndex >= 0 ? getColorForMergedIndex(mergedIndex) : null;
            
            return (
              <div
                key={idx}
                className={`interval-box ${isHighlighted ? 'highlighted' : ''} ${isCurrent ? 'current' : ''} ${colorGroup ? 'colored' : ''}`}
                style={colorGroup ? {
                  borderColor: colorGroup.light,
                  backgroundColor: colorGroup.bg,
                } : {}}
              >
                {isHighlighted && (
                  <div className="arrow-indicator">
                    <span className="arrow-icon">👇</span>
                    <span className="arrow-label">{language === 'zh' ? '检查' : 'Check'}</span>
                  </div>
                )}
                {colorGroup && (
                  <div className="color-indicator" style={{ backgroundColor: colorGroup.primary }}></div>
                )}
                <div className="interval-content">
                  <span className="interval-bracket">[</span>
                  <span className="interval-value">{interval.start}</span>
                  <span className="interval-separator">,</span>
                  <span className="interval-value">{interval.end}</span>
                  <span className="interval-bracket">]</span>
                </div>
                <div className="interval-index">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merged Intervals Result with Connection Arrows */}
      {mergedIntervals.length > 0 && (
        <div className="intervals-section merged-section" ref={mergedSectionRef}>
          <h3 className="section-title">
            {language === 'zh' 
              ? `合并结果（${type === 'complete' ? '最终' : '处理中'}）` 
              : `Merged Result (${type === 'complete' ? 'Final' : 'In Progress'})`
            }
          </h3>
          
          {/* SVG for connection arrows */}
          <svg 
            ref={svgRef}
            className="merge-connections-svg" 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              zIndex: 10 
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#66bb6a" opacity="0.8" />
              </marker>
              <marker
                id="arrowhead-processing"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#ffd700" opacity="0.9" />
              </marker>
            </defs>
          </svg>
          
          <div className="intervals-display">
            {mergedIntervals.map((interval, idx) => {
              const isLast = idx === mergedIntervals.length - 1;
              const isProcessing = isLast && type !== 'complete';
              const colorGroup = getColorForMergedIndex(idx);
              
              // 计算哪些原始区间被合并到这个区间中
              const sourceIntervals = intervals.filter(
                (orig, origIdx) => orig.start >= interval.start && orig.end <= interval.end
              );
              
              return (
                <div
                  key={idx}
                  className={`interval-box merged ${isProcessing ? 'processing' : ''} colored`}
                  data-merged-index={idx}
                  title={isProcessing ? (language === 'zh' ? '当前处理区间' : 'Current Processing') : ''}
                  style={{
                    borderColor: isProcessing ? '#ffd700' : colorGroup.primary,
                    backgroundColor: colorGroup.bg,
                  }}
                >
                  {/* 从哪些区间合并来的提示 */}
                  {sourceIntervals.length > 1 && (
                    <div className="merge-source-indicator" style={{ 
                      background: `linear-gradient(135deg, ${colorGroup.primary} 0%, ${colorGroup.light} 100%)` 
                    }}>
                      <span className="merge-icon">🔗</span>
                      <span className="merge-count">
                        {language === 'zh' ? `合并${sourceIntervals.length}个` : `${sourceIntervals.length} merged`}
                      </span>
                    </div>
                  )}
                  
                  <div className="color-indicator" style={{ backgroundColor: colorGroup.primary }}></div>
                  
                  <div className="interval-content">
                    <span className="interval-bracket">[</span>
                    <span className="interval-value">{interval.start}</span>
                    <span className="interval-separator">,</span>
                    <span className="interval-value">{interval.end}</span>
                    <span className="interval-bracket">]</span>
                  </div>
                  {isProcessing && (
                    <div className="processing-label">
                      {language === 'zh' ? '当前' : 'Current'}
                    </div>
                  )}
                  
                  {/* 显示源区间信息 */}
                  {sourceIntervals.length > 0 && (
                    <div className="source-intervals-tooltip" style={{ borderColor: colorGroup.primary }}>
                      {language === 'zh' ? '来自：' : 'From: '}
                      {sourceIntervals.map((src, i) => (
                        <span key={i} className="source-interval" style={{ color: colorGroup.light }}>
                          [{src.start},{src.end}]
                          {i < sourceIntervals.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Number Line Visualization */}
      {intervals.length > 0 && range > 0 && (
        <div className="number-line-section">
          <h3 className="section-title">
            {language === 'zh' ? '数轴示意图' : 'Number Line Visualization'}
            <span className="section-subtitle">
              {language === 'zh' ? `（范围：${minValue} ~ ${maxValue}）` : `(Range: ${minValue} ~ ${maxValue})`}
            </span>
          </h3>
          <div className="number-line-container">
            <div className="number-line-wrapper">
              <div 
                className="number-line"
                style={{
                  height: `${30 + (maxOriginalTrack + 1) * 22 + 30 + (maxMergedTrack + 1) * 22 + 20}px`
                }}
              >
                {/* 绘制背景基线 */}
                <div className="baseline"></div>
                
                {/* 原始区间和合并区间的分隔线 */}
                {mergedIntervalsWithTracks.length > 0 && (
                  <div 
                    className="separator-line"
                    style={{
                      top: `${30 + (maxOriginalTrack + 1) * 22 + 15}px`
                    }}
                  >
                    <span className="separator-label">
                      {language === 'zh' ? '⬇ 合并 ⬇' : '⬇ Merge ⬇'}
                    </span>
                  </div>
                )}
                
                {/* 绘制智能刻度 */}
                {ticks.map((value, i) => {
                  const position = ((value - minValue) / range) * 100;
                  return (
                    <div 
                      key={`tick-${i}`}
                      className="number-line-tick"
                      style={{ left: `${position}%` }}
                    >
                      <div className="tick-mark"></div>
                      <div className="tick-label">{value}</div>
                    </div>
                  );
                })}
                
                {/* 绘制所有原始区间 */}
                {intervalsWithTracks.map((interval, idx) => {
                  const left = Math.max(0, Math.min(100, ((interval.start - minValue) / range) * 100));
                  const right = Math.max(0, Math.min(100, ((interval.end - minValue) / range) * 100));
                  const width = right - left;
                  const isActive = idx === currentIndex || highlightIndices.includes(idx);
                  
                  // 获取颜色组
                  const originalInterval = intervals[idx];
                  const mergedIndex = getOriginalIntervalMergedIndex(originalInterval);
                  const colorGroup = mergedIndex >= 0 ? getColorForMergedIndex(mergedIndex) : null;
                  
                  // 根据轨道计算垂直位置
                  const trackHeight = 22; // 每个轨道的高度
                  const topPosition = 30 + interval.track * trackHeight;
                  
                  return (
                    <div
                      key={`original-${idx}`}
                      className={`number-line-interval original ${isActive ? 'active' : ''}`}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 0.5)}%`,
                        top: `${topPosition}px`
                      }}
                    >
                      <div 
                        className="interval-bar"
                        style={colorGroup ? {
                          backgroundColor: colorGroup.primary,
                          borderColor: colorGroup.light,
                        } : {}}
                      >
                        <div className="interval-endpoints">
                          <span className="endpoint start">{interval.start}</span>
                          <span className="endpoint end">{interval.end}</span>
                        </div>
                      </div>
                      {isActive && (
                        <div className="interval-pulse"></div>
                      )}
                    </div>
                  );
                })}

                {/* 绘制连接线（显示合并关系）*/}
                {mergedIntervalsWithTracks.length > 0 && type !== 'initial' && (
                  <svg className="connection-lines" style={{ 
                    top: `${30 + (maxOriginalTrack + 1) * 22 + 5}px`, 
                    height: `${30 + maxMergedTrack * 22 - (30 + (maxOriginalTrack + 1) * 22)}px` 
                  }}>
                    {mergedIntervalsWithTracks.map((merged, mIdx) => {
                      const mergedLeft = ((merged.start - minValue) / range) * 100;
                      const mergedRight = ((merged.end - minValue) / range) * 100;
                      const mergedCenter = (mergedLeft + mergedRight) / 2;
                      const colorGroup = getColorForMergedIndex(mIdx);
                      
                      return intervalsWithTracks.map((original, oIdx) => {
                        if (original.start >= merged.start && original.end <= merged.end) {
                          const origLeft = ((original.start - minValue) / range) * 100;
                          const origRight = ((original.end - minValue) / range) * 100;
                          const origCenter = (origLeft + origRight) / 2;
                          
                          return (
                            <line
                              key={`conn-${mIdx}-${oIdx}`}
                              x1={`${origCenter}%`}
                              y1="0"
                              x2={`${mergedCenter}%`}
                              y2="100%"
                              className="connection-line"
                              stroke={colorGroup.primary}
                              strokeDasharray="3,3"
                              opacity="0.6"
                            />
                          );
                        }
                        return null;
                      });
                    })}
                  </svg>
                )}

                {/* 绘制合并后的区间 */}
                {mergedIntervalsWithTracks.length > 0 && mergedIntervalsWithTracks.map((interval, idx) => {
                  const left = Math.max(0, Math.min(100, ((interval.start - minValue) / range) * 100));
                  const right = Math.max(0, Math.min(100, ((interval.end - minValue) / range) * 100));
                  const width = right - left;
                  const isProcessing = idx === mergedIntervals.length - 1 && type !== 'complete';
                  const colorGroup = getColorForMergedIndex(idx);
                  
                  // 合并区间从原始区间下方开始，留出间隔
                  const trackHeight = 22;
                  const startY = 30 + (maxOriginalTrack + 1) * trackHeight + 30;
                  const topPosition = startY + interval.track * trackHeight;
                  
                  return (
                    <div
                      key={`merged-${idx}`}
                      className={`number-line-interval merged ${isProcessing ? 'processing' : ''}`}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 0.5)}%`,
                        top: `${topPosition}px`
                      }}
                    >
                      <div 
                        className="interval-bar"
                        style={isProcessing ? {
                          backgroundColor: '#ffd700',
                          borderColor: '#ffed4e',
                        } : {
                          backgroundColor: colorGroup.primary,
                          borderColor: colorGroup.light,
                        }}
                      >
                        <div className="interval-endpoints">
                          <span className="endpoint start">{interval.start}</span>
                          <span className="endpoint end">{interval.end}</span>
                        </div>
                      </div>
                      {isProcessing && (
                        <>
                          <div className="interval-pulse processing-pulse"></div>
                          <div className="processing-badge">
                            {language === 'zh' ? '处理中' : 'Processing'}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="number-line-labels">
              <div className="label-row original-label">
                <div className="label-indicator"></div>
                {language === 'zh' ? '输入区间' : 'Input'}
              </div>
              <div className="label-row merged-label">
                <div className="label-indicator"></div>
                {language === 'zh' ? '合并后' : 'Merged'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Message with Icon */}
      <div className={`status-display ${type}`}>
        <div className="status-icon">
          {type === 'initial' && '🚀'}
          {type === 'sort' && '🔄'}
          {type === 'pick_first' && '👆'}
          {type === 'compare_overlap' && '🔍'}
          {type === 'merge' && '🔗'}
          {type === 'compare_no_overlap' && '❌'}
          {type === 'add_and_pick_new' && '✅'}
          {type === 'complete' && '🎉'}
        </div>
        <div className="status-content">
          <div className="status-type">{step.description}</div>
          <div className="status-message">{message}</div>
        </div>
      </div>
    </div>
  );
}

export default IntervalVisualization;
