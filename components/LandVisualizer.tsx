import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Coordinate } from '../types';
import { Compass, Map as MapIcon } from 'lucide-react';

interface Props {
  coordinates: Coordinate[];
}

const LandVisualizer: React.FC<Props> = ({ coordinates }) => {
  if (coordinates.length < 2) {
    return (
      <div className="h-64 sm:h-96 w-full bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-3">
        <MapIcon size={40} className="opacity-20 sm:w-12 sm:h-12" />
        <span className="text-sm sm:text-base">ต้องการอย่างน้อย 2 จุดเพื่อสร้างภาพแผนที่</span>
      </div>
    );
  }

  // Add index for labeling
  // We need to create a new array to avoid mutating the prop and to handle the closing loop
  const chartData = coordinates.map((c, i) => ({ ...c, index: i + 1, isClosure: false }));
  
  // Explicitly close the loop if not already closed for visualization
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  
  // Check if the last point is different from the first point
  if (coordinates.length > 2 && (first.x !== last.x || first.y !== last.y)) {
    chartData.push({ ...first, index: 1, isClosure: true } as any);
  }

  // Calculate domains with padding
  const xValues = chartData.map(c => c.x);
  const yValues = chartData.map(c => c.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Add padding (15% of range)
  const rangeX = maxX - minX || 100;
  const rangeY = maxY - minY || 100;
  const paddingX = rangeX * 0.15;
  const paddingY = rangeY * 0.15;

  const domainX = [minX - paddingX, maxX + paddingX];
  const domainY = [minY - paddingY, maxY + paddingY];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 relative">
       {/* Header with Title and System Badge */}
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4 gap-2">
         <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-emerald-600" />
                แผนที่รูปแปลงที่ดิน
            </h3>
            <p className="text-xs text-gray-500 mt-1 pl-7 hidden sm:block">Projection: UTM / Unit: Meters</p>
         </div>
         <div className="flex self-start sm:self-auto">
             <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                WGS84 / UTM
             </span>
         </div>
       </div>

       {/* Map Container - Responsive Height: h-80 on mobile, h-[500px] on desktop */}
       <div className="h-80 sm:h-96 md:h-[500px] w-full relative bg-slate-50 rounded-lg border border-gray-200 overflow-hidden">
          
          {/* North Arrow */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col items-center pointer-events-none opacity-90">
             <div className="relative transform scale-75 sm:scale-100 origin-top-right">
                <Compass size={56} className="text-gray-800 drop-shadow-sm" strokeWidth={1} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 font-serif text-red-600 font-bold text-sm">N</div>
             </div>
          </div>

          {/* Scale/Grid Info - Hidden on very small screens if needed, or scaled down */}
          <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded shadow-sm border border-gray-200 text-[9px] sm:text-[10px] text-gray-600 pointer-events-none">
             <div><strong>System:</strong> UTM</div>
             <div><strong>X:</strong> Easting (m)</div>
             <div><strong>Y:</strong> Northing (m)</div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Easting" 
                domain={domainX} 
                tickFormatter={(val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                label={{ value: 'Easting (X)', position: 'bottom', offset: 0, fontSize: 10, fill: '#475569' }}
                tick={{fontSize: 9, fill: '#64748b'}}
                stroke="#94a3b8"
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Northing" 
                domain={domainY} 
                tickFormatter={(val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                label={{ value: 'Northing (Y)', angle: -90, position: 'left', offset: 0, fontSize: 10, fill: '#475569' }}
                width={60}
                tick={{fontSize: 9, fill: '#64748b'}}
                stroke="#94a3b8"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#ef4444' }} 
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-white/95 backdrop-blur p-2 sm:p-3 border border-gray-200 shadow-xl rounded-lg text-xs z-50">
                            <p className="font-bold text-emerald-700 mb-1 border-b border-gray-100 pb-1">
                                {data.isClosure ? 'Closing Point (1)' : `Point ${data.index}`}
                            </p>
                            <div className="space-y-1 font-mono text-gray-600">
                                <p>X: {data.x.toLocaleString()}</p>
                                <p>Y: {data.y.toLocaleString()}</p>
                            </div>
                        </div>
                    );
                    }
                    return null;
                }}
              />
              <Scatter 
                name="Points" 
                data={chartData} 
                fill="#059669" 
                line={{ stroke: '#059669', strokeWidth: 2 }}
                lineType="joint"
                isAnimationActive={false}
                shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.isClosure) return <g />;
                    return (
                        <circle cx={cx} cy={cy} r={4} fill="#047857" stroke="white" strokeWidth={1.5} />
                    );
                }}
              >
                  <LabelList 
                    dataKey="index" 
                    position="top" 
                    offset={8}
                    style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1f2937' }} 
                    formatter={(val: any) => val ? `P${val}` : ''}
                  />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
       </div>
       
       <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white shadow-sm"></span>
                <span>จุดพิกัด</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="w-5 h-0.5 bg-emerald-600"></span>
                <span>แนวเขตที่ดิน</span>
            </div>
       </div>
    </div>
  );
};

export default LandVisualizer;