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

// Beautiful gradient color palette optimized for both light and dark modes
const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#84cc16', // Lime
  '#a855f7', // Violet
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
  
  // Handle empty data gracefully
  if (!data || data.length === 0) {
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
        <div className={`flex items-center justify-center h-64 rounded-lg border-2 border-dashed ${
          isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'
        }`}>
          <p className="text-sm">No data available for chart</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 rounded-xl border my-4 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/20 shadow-xl' 
        : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
    }`}>
      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <span className="text-2xl">📊</span>
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={350}>
        {type === 'line' && (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -10, fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <YAxis 
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: textColor
              }}
              cursor={{ stroke: COLORS[0], strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              animationDuration={800}
            />
          </LineChart>
        )}
        
        {type === 'bar' && (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -10, fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <YAxis 
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: textColor
              }}
              cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="value" 
              fill="#8884d8" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.9}
                />
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
              labelLine={{
                stroke: textColor,
                strokeWidth: 1
              }}
              label={(entry) => {
                const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                return `${entry.name}: ${percent}%`;
              }}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.9}
                  stroke={isDarkMode ? '#1f2937' : '#fff'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: textColor
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        )}

        {type === 'area' && (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -10, fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <YAxis 
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: textColor
              }}
              cursor={{ stroke: COLORS[0], strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS[0]}
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)"
              animationDuration={800}
            />
          </AreaChart>
        )}

        {type === 'scatter' && (
          <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -10, fill: textColor } : undefined}
            />
            <YAxis 
              dataKey="value"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: textColor }}
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: textColor } : undefined}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${gridColor}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: textColor
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Scatter 
              name="Data Points" 
              data={data} 
              fill={COLORS[0]}
              shape="circle"
              animationDuration={800}
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
