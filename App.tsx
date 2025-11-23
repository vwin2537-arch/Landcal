import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Coordinate, ThaiArea } from './types';
import { calculatePolygonArea, convertToThaiUnits } from './utils/calculations';
import CoordinateInput from './components/CoordinateInput';
import CoordinateTable from './components/CoordinateTable';
import LandVisualizer from './components/LandVisualizer';
import ResultCard from './components/ResultCard';
import { Map, RefreshCw, AlertCircle, Download, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  const handleAddCoordinate = (coord: Omit<Coordinate, 'id'>) => {
    const newCoord = { ...coord, id: uuidv4() };
    setCoordinates(prev => [...prev, newCoord]);
  };

  const handleDeleteCoordinate = (id: string) => {
    setCoordinates(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateCoordinate = (id: string, newCoord: Partial<Coordinate>) => {
    setCoordinates(prev => prev.map(c => c.id === id ? { ...c, ...newCoord } as Coordinate : c));
  };

  const handleReset = () => {
    setCoordinates([]);
  };

  // Export Coordinates for GIS
  const handleExportCSV = () => {
    if (coordinates.length === 0) return;

    // Add BOM for Excel compatibility
    const BOM = "\uFEFF";
    const headers = "Point,Easting (X),Northing (Y)";
    const rows = coordinates.map((c, index) => `${index + 1},${c.x},${c.y}`).join("\n");
    const csvContent = `${BOM}${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `land_coordinates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const areaResult: ThaiArea = useMemo(() => {
    const sqMeters = calculatePolygonArea(coordinates);
    return convertToThaiUnits(sqMeters);
  }, [coordinates]);

  // Export Calculated Area Result
  const handleExportCalculation = () => {
    if (areaResult.totalSqMeters <= 0) return;

    const BOM = "\uFEFF";
    const content = [
        "Land Area Calculation Result",
        `Date,${new Date().toLocaleString('th-TH')}`,
        "",
        "Thai Measurement System",
        "Rai,Ngan,Sq.Wah,Total Sq.Wah",
        `${areaResult.rai},${areaResult.ngan},${areaResult.sqWah.toFixed(2)},${areaResult.totalSqWah.toFixed(2)}`,
        "",
        "Metric System",
        "Total Sq.Meters",
        `${areaResult.totalSqMeters.toFixed(2)}`
    ].join("\n");

    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `land_area_result_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <Map className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">LandCal <span className="text-emerald-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-2">
            {coordinates.length > 0 && (
              <button 
                onClick={handleExportCSV}
                className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2 text-sm font-medium px-2 py-2 sm:px-3 rounded-lg hover:bg-gray-50"
                title="ดาวน์โหลดไฟล์ CSV สำหรับ GIS"
              >
                <Download className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">ส่งออกพิกัด (GIS)</span>
              </button>
            )}
            
            <button 
              onClick={handleReset}
              disabled={coordinates.length === 0}
              className={`
                flex items-center gap-2 text-sm font-medium px-3 py-2 sm:px-3 rounded-lg transition-all
                ${coordinates.length === 0 
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed' 
                    : 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 shadow-sm'
                }
              `}
              title="ล้างข้อมูลทั้งหมด"
            >
              <RefreshCw className={`w-4 h-4 sm:w-4 sm:h-4 ${coordinates.length > 0 ? '' : 'opacity-50'}`} />
              <span className="hidden sm:inline">ล้างข้อมูลทั้งหมด</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Inputs & Table */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-1">
            <section>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">1. ป้อนข้อมูลพิกัด (UTM)</h2>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{coordinates.length} จุด</span>
                </div>
                <CoordinateInput onAdd={handleAddCoordinate} />
            </section>
            
            <section>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">2. รายการพิกัด</h2>
                <CoordinateTable 
                    coordinates={coordinates} 
                    onDelete={handleDeleteCoordinate}
                    onUpdate={handleUpdateCoordinate}
                />
            </section>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-2">
            <section>
                 <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">3. สรุปผลการคำนวน</h2>
                     {areaResult.totalSqMeters > 0 && (
                        <button 
                            onClick={handleExportCalculation}
                            className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg border border-blue-100"
                            title="ดาวน์โหลดผลการคำนวน"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Export ผลคำนวน</span>
                        </button>
                    )}
                 </div>
                <ResultCard area={areaResult} />
            </section>

             <section>
                <LandVisualizer coordinates={coordinates} />
             </section>
             
             {coordinates.length > 0 && coordinates.length < 3 && (
                 <div className="flex items-start gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl text-sm border border-amber-100">
                     <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                     <p>จำเป็นต้องมีพิกัดอย่างน้อย 3 จุด เพื่อให้ระบบสามารถคำนวนเนื้อที่และสร้างรูปแปลงที่ดินได้อย่างถูกต้อง</p>
                 </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;