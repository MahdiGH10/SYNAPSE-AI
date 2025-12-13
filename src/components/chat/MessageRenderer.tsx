"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DynamicChart from '../charts/DynamicChart';
import YouTubeRecommendations from './YouTubeRecommendations';

interface MessageRendererProps {
  content: string;
  isDarkMode: boolean;
}

export default function MessageRenderer({ content, isDarkMode }: MessageRendererProps) {
  // Detect if message contains chart or YouTube data
  const chartMatches = content.matchAll(/```chart\n([\s\S]*?)\n```/g);
  const youtubeMatches = content.matchAll(/```youtube\n([\s\S]*?)\n```/g);
  
  const chartMatchesArray = Array.from(chartMatches);
  const youtubeMatchesArray = Array.from(youtubeMatches);
  
  const hasSpecialContent = chartMatchesArray.length > 0 || youtubeMatchesArray.length > 0;
  
  if (hasSpecialContent) {
    // Combine all matches and sort by position
    const allMatches: Array<{ type: 'chart' | 'youtube', match: RegExpMatchArray }> = [
      ...chartMatchesArray.map(m => ({ type: 'chart' as const, match: m })),
      ...youtubeMatchesArray.map(m => ({ type: 'youtube' as const, match: m }))
    ].sort((a, b) => (a.match.index || 0) - (b.match.index || 0));
    
    // Split content into parts
    const parts: Array<{ type: 'text' | 'chart' | 'youtube', content: any }> = [];
    let lastIndex = 0;
    
    allMatches.forEach(({ type, match }) => {
      const matchIndex = match.index || 0;
      
      // Add text before special content
      if (matchIndex > lastIndex) {
        const textBefore = content.substring(lastIndex, matchIndex);
        if (textBefore.trim()) {
          parts.push({ type: 'text', content: textBefore });
        }
      }
      
      // Add chart or YouTube
      try {
        const data = JSON.parse(match[1]);
        // Validate YouTube data structure
        if (type === 'youtube' && (!data.recommendations || !Array.isArray(data.recommendations))) {
          console.error('Invalid YouTube data structure:', data);
        } else {
          parts.push({ type, content: data });
        }
      } catch (e) {
        console.error(`Failed to parse ${type} JSON:`, e);
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
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                {part.content}
              </ReactMarkdown>
            );
          } else if (part.type === 'chart') {
            return (
              <DynamicChart
                key={index}
                type={part.content.type}
                data={part.content.data}
                title={part.content.title}
                xLabel={part.content.xLabel}
                yLabel={part.content.yLabel}
                isDarkMode={isDarkMode}
              />
            );
          } else if (part.type === 'youtube') {
            return (
              <YouTubeRecommendations
                key={index}
                query={part.content.query}
                recommendations={part.content.recommendations}
                isDarkMode={isDarkMode}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }
  
  // No special content, render regular markdown
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
