"use client";
import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  duration: string;
  description: string;
  topics: string[];
}

interface YouTubeRecommendationsProps {
  query: string;
  recommendations: YouTubeVideo[];
  isDarkMode?: boolean;
}

export default function YouTubeRecommendations({ 
  query, 
  recommendations, 
  isDarkMode = false 
}: YouTubeRecommendationsProps) {
  
  // Validate recommendations
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return null;
  }
  
  // Extract video ID from URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : '';
  };

  const getThumbnail = (url: string) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  return (
    <div className={`my-4 rounded-lg border ${
      isDarkMode 
        ? 'bg-[#2b2b2b] border-[#424242]' 
        : 'bg-[#f7f7f8] border-[#e5e5e5]'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${
        isDarkMode ? 'border-[#424242]' : 'border-[#e5e5e5]'
      }`}>
        <p className={`text-sm font-medium ${
          isDarkMode ? 'text-[#ececf1]' : 'text-[#374151]'
        }`}>
          Here are some excellent Machine Learning tutorials on YouTube — whether you're a complete beginner or want structured learning:
        </p>
      </div>

      {/* Video List */}
      <div className="divide-y divide-[#424242]">
        {recommendations.map((video, index) => {
          const thumbnail = getThumbnail(video.url);
          
          return (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-4 py-3 transition-colors ${
                isDarkMode 
                  ? 'hover:bg-[#3b3b3b]' 
                  : 'hover:bg-[#ececec]'
              }`}
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-32 h-[72px] rounded overflow-hidden bg-black">
                  {thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="text-white opacity-60" size={32} />
                    </div>
                  )}
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/90 rounded text-white text-[11px] font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className={`text-sm font-medium mb-1 line-clamp-2 ${
                    isDarkMode ? 'text-[#ececf1]' : 'text-[#111827]'
                  }`}>
                    {video.title}
                  </h4>

                  {/* Channel & Description */}
                  <p className={`text-xs mb-1 ${
                    isDarkMode ? 'text-[#9b9b9b]' : 'text-[#6b7280]'
                  }`}>
                    {video.channel}
                  </p>
                  
                  <p className={`text-xs line-clamp-2 ${
                    isDarkMode ? 'text-[#9b9b9b]' : 'text-[#6b7280]'
                  }`}>
                    {video.description}
                  </p>
                </div>

                {/* External Link Icon */}
                <div className="flex-shrink-0 pt-1">
                  <ExternalLink className={isDarkMode ? 'text-[#9b9b9b]' : 'text-[#6b7280]'} size={14} />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
