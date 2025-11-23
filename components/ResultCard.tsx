import React, { useState } from 'react';
import { ThaiArea } from '../types';
import { formatNumber } from '../utils/calculations';
import { LandPlot, Square, Copy, Check } from 'lucide-react';

interface Props {
  area: ThaiArea;
}

const ResultCard: React.FC<Props> = ({ area }) => {
  const [copiedThai, setCopiedThai] = useState(false);
  const [copiedRai, setCopiedRai] = useState(false);

  // Calculate total area in Rai (decimal)
  // 1 Rai = 400 Sq.Wah
  const totalRaiDecimal = area.totalSqWah / 400;

  const copyThaiString = () => {
    const text = `${area.rai} ไร่ ${area.ngan} งาน ${area.sqWah.toFixed(2)} ตารางวา`;
    navigator.clipboard.writeText(text);
    setCopiedThai(true);
    setTimeout(() => setCopiedThai(false), 2000);
  };
  
  const copyTotalRai = () => {
    const text = `${formatNumber(totalRaiDecimal)} ไร่`;
    navigator.clipboard.writeText(text);
    setCopiedRai(true);
    setTimeout(() => setCopiedRai(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Thai Units Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10 pointer-events-none">
          <LandPlot size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="text-emerald-100 text-sm font-semibold uppercase tracking-wider">ขนาดเนื้อที่ (ไทย)</h3>
            <button 
                onClick={copyThaiString}
                className="text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm"
                title="คัดลอกข้อความ: X ไร่ Y งาน Z ตร.ว."
            >
                {copiedThai ? <Check size={14} /> : <Copy size={14} />}
                {copiedThai ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
        </div>

        <div className="flex items-end gap-2 mb-4 relative z-10">
            <span className="text-4xl font-bold">{area.rai}</span>
            <span className="text-lg opacity-90 pb-1">ไร่</span>
            
            <span className="text-4xl font-bold ml-2">{area.ngan}</span>
            <span className="text-lg opacity-90 pb-1">งาน</span>
            
            <span className="text-4xl font-bold ml-2">{area.sqWah.toFixed(1)}</span>
            <span className="text-lg opacity-90 pb-1">ตร.ว.</span>
        </div>
        
        <div className="border-t border-emerald-500/30 pt-3 mt-2 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-sm text-emerald-100">
                <span>รวมทั้งหมด {formatNumber(area.totalSqWah)} ตารางวา</span>
            </div>
            
            {/* Total Rai Decimal Line */}
             <div className="flex items-center justify-between text-sm text-emerald-50 bg-emerald-800/20 p-2 rounded-lg border border-emerald-500/30">
                <span>จำนวนไร่ทั้งหมด <strong>{formatNumber(totalRaiDecimal)} ไร่</strong></span>
                <button 
                    onClick={copyTotalRai}
                    className="text-emerald-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
                    title="คัดลอกจำนวนไร่รวม"
                >
                    {copiedRai ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                </button>
            </div>
        </div>
      </div>

      {/* Metric Units Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative">
         <div className="absolute top-4 right-4 text-gray-300">
          <Square size={24} />
        </div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">ระบบเมตริก</h3>
        <div className="flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-800">{formatNumber(area.totalSqMeters)}</span>
             <span className="text-gray-600">ตร.ม.</span>
        </div>
         <p className="text-sm text-gray-400 mt-2">
            คำนวนจากสูตร Shoelace (Polygon Area)
        </p>
      </div>
    </div>
  );
};

export default ResultCard;