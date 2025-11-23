import React, { useState } from 'react';
import { PlusCircle, MapPin } from 'lucide-react';
import { Coordinate } from '../types';

interface Props {
  onAdd: (coord: Omit<Coordinate, 'id'>) => void;
}

const CoordinateInput: React.FC<Props> = ({ onAdd }) => {
  const [x, setX] = useState<string>('');
  const [y, setY] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicitly check for empty strings to allow '0' as a valid coordinate
    if (x.trim() === '' || y.trim() === '') return;

    onAdd({
      x: parseFloat(x),
      y: parseFloat(y)
    });

    setX('');
    setY('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-emerald-600" />
        เพิ่มพิกัด UTM
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ค่า X (Easting)</label>
            <input
              type="number"
              step="any"
              value={x}
              onChange={(e) => setX(e.target.value)}
              placeholder="e.g. 670000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ค่า Y (Northing)</label>
            <input
              type="number"
              step="any"
              value={y}
              onChange={(e) => setY(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          เพิ่มจุดพิกัด
        </button>
      </form>
    </div>
  );
};

export default CoordinateInput;