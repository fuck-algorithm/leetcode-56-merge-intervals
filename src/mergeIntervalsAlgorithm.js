// Generate step-by-step animation for merge intervals algorithm
export function generateMergeSteps(intervals) {
  const steps = [];
  
  // Step 0: Initial state
  steps.push({
    type: 'initial',
    description: '初始化',
    intervals: intervals.map((interval, idx) => ({ ...interval, originalIndex: idx })),
    currentIndex: -1,
    mergedIntervals: [],
    highlightIndices: [],
    message: `开始合并区间算法。共有 ${intervals.length} 个区间需要处理。算法思路：先排序，再依次合并有重叠的区间。`
  });

  if (intervals.length === 0) {
    return steps;
  }

  // Step 1: Sort intervals by start time
  const sortedIntervals = [...intervals].map((interval, idx) => ({ 
    ...interval, 
    originalIndex: idx 
  })).sort((a, b) => a.start - b.start);

  steps.push({
    type: 'sort',
    description: '排序',
    intervals: sortedIntervals,
    currentIndex: -1,
    mergedIntervals: [],
    highlightIndices: [],
    message: `第1步：按照区间起始位置从小到大排序。排序后的顺序是关键，这样能保证相邻的重叠区间一定能被检测到。时间复杂度 O(n log n)。`
  });

  // Step 2: Start merging
  const merged = [];
  let current = { ...sortedIntervals[0] };
  
  steps.push({
    type: 'pick_first',
    description: '选择第一个区间',
    intervals: sortedIntervals,
    currentIndex: 0,
    mergedIntervals: [current],
    highlightIndices: [0],
    message: `第2步：选择第一个区间 [${current.start}, ${current.end}] 作为"当前区间"。我们将用这个区间去尝试合并后续的区间。如果后续区间与它重叠，就扩展右边界；如果不重叠，就保存它并切换到新区间。`
  });

  // Iterate through remaining intervals
  for (let i = 1; i < sortedIntervals.length; i++) {
    const interval = sortedIntervals[i];
    
    // Check if current interval overlaps with the next one
    if (current.end >= interval.start) {
      // Overlapping - merge them
      const beforeMerge = { ...current };
      steps.push({
        type: 'compare_overlap',
        description: '检测到重叠',
        intervals: sortedIntervals,
        currentIndex: i,
        mergedIntervals: [...merged, beforeMerge],
        highlightIndices: [i],
        message: `比较：区间 [${interval.start}, ${interval.end}] 的起点 ${interval.start} ≤ 当前区间 [${beforeMerge.start}, ${beforeMerge.end}] 的终点 ${beforeMerge.end}，判断为重叠！重叠条件：current.end >= next.start。接下来需要合并这两个区间。`
      });

      const oldEnd = current.end;
      current.end = Math.max(current.end, interval.end);
      
      steps.push({
        type: 'merge',
        description: '合并区间',
        intervals: sortedIntervals,
        currentIndex: i,
        mergedIntervals: [...merged, current],
        highlightIndices: [i],
        message: `合并操作：保持左边界 ${current.start} 不变，右边界取两者最大值 max(${oldEnd}, ${interval.end}) = ${current.end}。${oldEnd !== current.end ? `右边界从 ${oldEnd} 扩展到 ${current.end}，区间变长了！` : `右边界保持 ${current.end} 不变，因为新区间被完全包含。`}合并后得到 [${current.start}, ${current.end}]。`
      });
    } else {
      // No overlap - add current to result and start new interval
      const oldCurrent = { ...current };
      steps.push({
        type: 'compare_no_overlap',
        description: '无重叠',
        intervals: sortedIntervals,
        currentIndex: i,
        mergedIntervals: [...merged, oldCurrent],
        highlightIndices: [i],
        message: `比较：区间 [${interval.start}, ${interval.end}] 的起点 ${interval.start} > 当前区间 [${oldCurrent.start}, ${oldCurrent.end}] 的终点 ${oldCurrent.end}，两个区间之间有间隔，不重叠！不重叠条件：current.end < next.start。这意味着当前区间已经无法继续扩展了，需要保存它并开始新的合并。`
      });

      merged.push(current);
      current = { ...interval };
      
      steps.push({
        type: 'add_and_pick_new',
        description: '保存并切换',
        intervals: sortedIntervals,
        currentIndex: i,
        mergedIntervals: [...merged, current],
        highlightIndices: [i],
        message: `保存当前区间：将 [${merged[merged.length - 1].start}, ${merged[merged.length - 1].end}] 加入结果集（已完成合并，不会再变化）。切换操作：选择新区间 [${current.start}, ${current.end}] 作为新的"当前区间"，继续向后寻找可以合并的区间。目前已完成 ${merged.length} 个区间的合并。`
      });
    }
  }

  // Add the last interval
  merged.push(current);
  steps.push({
    type: 'complete',
    description: '完成',
    intervals: sortedIntervals,
    currentIndex: sortedIntervals.length - 1,
    mergedIntervals: merged,
    highlightIndices: [],
    message: `🎉 算法完成！所有区间都已处理完毕。原始 ${intervals.length} 个区间经过排序和合并，最终得到 ${merged.length} 个互不重叠的区间。时间复杂度：O(n log n)（排序）+ O(n)（合并）= O(n log n)。空间复杂度：O(n)（存储结果）。`
  });

  return steps;
}

// Parse interval string like "[[1,3],[2,6],[8,10]]" or "1,3;2,6;8,10"
export function parseIntervals(input) {
  try {
    // Remove all whitespace
    input = input.trim().replace(/\s/g, '');
    
    // Try JSON format first
    if (input.startsWith('[[')) {
      const parsed = JSON.parse(input);
      return parsed.map(([start, end]) => ({ start, end }));
    }
    
    // Try semicolon-separated format: "1,3;2,6;8,10"
    if (input.includes(';')) {
      return input.split(';').map(interval => {
        const [start, end] = interval.split(',').map(Number);
        return { start, end };
      });
    }
    
    // Try simple comma format for single interval: "1,3"
    const parts = input.split(',').map(Number);
    if (parts.length === 2) {
      return [{ start: parts[0], end: parts[1] }];
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// Format intervals for display
export function formatIntervals(intervals) {
  return '[[' + intervals.map(i => `${i.start},${i.end}`).join('],[') + ']]';
}

// Preset examples
export const EXAMPLES = {
  example1: {
    name: '力扣示例1',
    intervals: [
      { start: 1, end: 3 },
      { start: 2, end: 6 },
      { start: 8, end: 10 },
      { start: 15, end: 18 }
    ]
  },
  example2: {
    name: '力扣示例2',
    intervals: [
      { start: 1, end: 4 },
      { start: 4, end: 5 }
    ]
  },
  example3: {
    name: '力扣示例3',
    intervals: [
      { start: 4, end: 7 },
      { start: 1, end: 4 }
    ]
  },
  allOverlap: {
    name: '全部重叠',
    intervals: [
      { start: 1, end: 10 },
      { start: 2, end: 6 },
      { start: 3, end: 8 },
      { start: 4, end: 12 }
    ]
  },
  noOverlap: {
    name: '无重叠',
    intervals: [
      { start: 1, end: 2 },
      { start: 3, end: 4 },
      { start: 5, end: 6 },
      { start: 7, end: 8 }
    ]
  },
  complex: {
    name: '复杂情况',
    intervals: [
      { start: 1, end: 4 },
      { start: 0, end: 2 },
      { start: 3, end: 5 },
      { start: 6, end: 9 },
      { start: 8, end: 10 },
      { start: 12, end: 16 }
    ]
  }
};
