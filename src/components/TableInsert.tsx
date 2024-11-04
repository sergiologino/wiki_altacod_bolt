import React, { useState } from 'react';
import { Table2 } from 'lucide-react';

interface TableInsertProps {
  onTableInsert: (rows: number, cols: number) => void;
}

const TableInsert: React.FC<TableInsertProps> = ({ onTableInsert }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [hoveredCells, setHoveredCells] = useState({ rows: 0, cols: 0 });
  const maxRows = 6;
  const maxCols = 6;

  const handleMouseEnter = (row: number, col: number) => {
    setHoveredCells({ rows: row + 1, cols: col + 1 });
  };

  const handleClick = () => {
    onTableInsert(hoveredCells.rows, hoveredCells.cols);
    setShowGrid(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => setShowGrid(!showGrid)}
        title="Insert table"
      >
        <Table2 className="w-4 h-4" />
      </button>

      {showGrid && (
        <div className="absolute z-10 mt-1 p-2 bg-white border rounded-md shadow-lg">
          <div className="mb-2 text-xs text-gray-500">
            {hoveredCells.rows} x {hoveredCells.cols}
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
            {Array.from({ length: maxRows }).map((_, rowIndex) =>
              Array.from({ length: maxCols }).map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-4 h-4 border ${
                    rowIndex < hoveredCells.rows && colIndex < hoveredCells.cols
                      ? 'bg-blue-200 border-blue-400'
                      : 'border-gray-300'
                  }`}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onClick={handleClick}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableInsert;