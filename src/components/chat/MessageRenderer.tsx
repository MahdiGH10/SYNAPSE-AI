"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DynamicChart from '../charts/DynamicChart';

interface MessageRendererProps {
  content: string;
  isDarkMode: boolean;
}

export default function MessageRenderer({ content, isDarkMode }: MessageRendererProps) {
  // Detect if message contains chart data
  const chartMatches = content.matchAll(/```chart\n([\s\S]*?)\n```/g);
  const matches = Array.from(chartMatches);
  
  if (matches.length > 0) {
    // Split content into parts: text before chart, chart, text after chart, etc.
    const parts: Array<{ type: 'text' | 'chart', content: any }> = [];
    let lastIndex = 0;
    
    matches.forEach(match => {
      const matchIndex = match.index || 0;
      
      // Add text before chart
      if (matchIndex > lastIndex) {
        const textBefore = content.substring(lastIndex, matchIndex);
        if (textBefore.trim()) {
          parts.push({ type: 'text', content: textBefore });
        }
      }
      
      // Add chart
      try {
        const chartData = JSON.parse(match[1]);
        parts.push({ type: 'chart', content: chartData });
      } catch (e) {
        console.error('Failed to parse chart JSON:', e);
        parts.push({ type: 'text', content: match[0] }); // Show raw code block if parsing fails
      }
      
      lastIndex = matchIndex + match[0].length;
    });
    
    // Add remaining text after last chart
    if (lastIndex < content.length) {
      const textAfter = content.substring(lastIndex);
      if (textAfter.trim()) {
        parts.push({ type: 'text', content: textAfter });
      }
    }
    
    // Render all parts
    return (
      <div className="space-y-2">
        {parts.map((part, index) => (
          part.type === 'text' ? (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
              {part.content}
            </ReactMarkdown>
          ) : (
            <DynamicChart
              key={index}
              type={part.content.type}
              data={part.content.data}
              title={part.content.title}
              xLabel={part.content.xLabel}
              yLabel={part.content.yLabel}
              isDarkMode={isDarkMode}
            />
          )
        ))}
      </div>
    );
  }
  
  // No charts, render regular markdown
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
