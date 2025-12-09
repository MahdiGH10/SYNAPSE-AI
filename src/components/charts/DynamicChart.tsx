"use client";
import React from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DynamicChartProps {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  data: any[];
  title: string;
  xLabel?: string;
  yLabel?: string;
  isDarkMode?: boolean;
}

const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#8884d8', // Purple
  '#82ca9d', // Light Green
  '#ffc658', // Gold
  '#ff7c7c', // Pink
  '#8dd1e1', // Sky Blue
  '#d084d0', // Lavender
];

export default function DynamicChart({
  type,
  data,
  title,
  xLabel,
  yLabel,
  isDarkMode = false,
}: DynamicChartProps) {
  
  const textColor = isDarkMode ? '#e5e7eb' : '#1f2937';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  
  return (
    <div className={`p-6 rounded-xl border my-4 ${
      isDarkMode 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <h3 className={`text-lg font-bold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        📊 {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' && (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              label={{ value: xLabel, position: 'insideBottom', offset: -5 }} 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <YAxis 
              label={{ value: yLabel, angle: -90, position: 'insideLeft' }} 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                color: textColor
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0088FE" 
              strokeWidth={2}
              dot={{ fill: '#0088FE', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
        
        {type === 'bar' && (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <YAxis 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                color: textColor
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
        
        {type === 'pie' && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                color: textColor
              }}
            />
            <Legend />
          </PieChart>
        )}

        {type === 'area' && (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <YAxis 
              stroke={textColor}
              tick={{ fill: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                color: textColor
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        )}

        {type === 'scatter' && (
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              tick={{ fill: textColor }}
              label={{ value: xLabel, position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              dataKey="value"
              stroke={textColor}
              tick={{ fill: textColor }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                color: textColor
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend />
            <Scatter 
              name="Data Points" 
              data={data} 
              fill="#8884d8"
            />
          </ScatterChart>
        )}
      </ResponsiveContainer>

      {/* Data summary */}
      <div className={`mt-4 pt-4 border-t text-sm ${
        isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'
      }`}>
        <span className="font-semibold">Data points:</span> {data.length} | 
        <span className="ml-2 font-semibold">Type:</span> {type.charAt(0).toUpperCase() + type.slice(1)} Chart
      </div>
    </div>
  );
}
