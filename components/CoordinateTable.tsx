import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Coordinate } from '../types';

interface Props {
  coordinates: Coordinate[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, newCoord: Partial<Coordinate>) => void;
}

const CoordinateTable: React.FC<Props> = ({ coordinates, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ x: string; y: string }>({ x: '', y: '' });

  const startEdit = (coord: Coordinate) => {
    setEditingId(coord.id);
    setEditForm({ x: coord.x.toString(), y: coord.y.toString() });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ x: '', y: '' });
  };

  const saveEdit = (id: string) => {
    onUpdate(id, {
      x: parseFloat(editForm.x),
      y: parseFloat(editForm.y)
    });
    setEditingId(null);
  };

  if (coordinates.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
        <p className="text-gray-500">ยังไม่มีข้อมูลพิกัด กรุณาเพิ่มจุดพิกัดทางด้านบน</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
            <tr>
              <th className="px-6 py-3">จุดที่</th>
              <th className="px-6 py-3">X (Easting)</th>
              <th className="px-6 py-3">Y (Northing)</th>
              <th className="px-6 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coordinates.map((coord, index) => (
              <tr key={coord.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                
                {editingId === coord.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.x}
                        onChange={(e) => setEditForm({ ...editForm, x: e.target.value })}
                        className="w-32 px-2 py-1 border rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.y}
                        onChange={(e) => setEditForm({ ...editForm, y: e.target.value })}
                        className="w-32 px-2 py-1 border rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => saveEdit(coord.id)} className="text-emerald-600 hover:text-emerald-800 p-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="text-red-600 hover:text-red-800 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-gray-600 font-mono">{coord.x.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{coord.y.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(coord)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(coord.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinateTable;