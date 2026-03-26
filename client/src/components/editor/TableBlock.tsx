import React, { useState, useCallback } from 'react';
import type { Block, TableCell } from '../../types';
import { Plus, Minus, Merge, X } from 'lucide-react';

interface Props {
  block: Block;
  onChange: (data: Record<string, unknown>) => void;
}

const TableBlock: React.FC<Props> = ({ block, onChange }) => {
  const rows = (block.data.rows as TableCell[][]) || [
    [{ content: '', rowSpan: 1, colSpan: 1 }],
  ];

  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const updateRows = useCallback(
    (newRows: TableCell[][]) => {
      onChange({ rows: newRows });
    },
    [onChange]
  );

  const updateCell = (r: number, c: number, content: string) => {
    const newRows = rows.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? { ...cell, content } : cell))
    );
    updateRows(newRows);
  };

  const addRow = () => {
    const colCount = rows[0]?.length || 1;
    const newRow: TableCell[] = Array.from({ length: colCount }, () => ({
      content: '',
      rowSpan: 1,
      colSpan: 1,
    }));
    updateRows([...rows, newRow]);
  };

  const removeRow = () => {
    if (rows.length <= 1) return;
    updateRows(rows.slice(0, -1));
  };

  const addColumn = () => {
    const newRows = rows.map((row) => [
      ...row,
      { content: '', rowSpan: 1, colSpan: 1 },
    ]);
    updateRows(newRows);
  };

  const removeColumn = () => {
    if ((rows[0]?.length || 0) <= 1) return;
    const newRows = rows.map((row) => row.slice(0, -1));
    updateRows(newRows);
  };

  // Cell selection for merging
  const handleCellMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setSelectedCells((prev) => [...prev, [r, c]]);
    } else {
      setSelectedCells([[r, c]]);
      setIsSelecting(true);
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (isSelecting) {
      // Select rectangular region from first cell to current
      const start = selectedCells[0];
      if (!start) return;
      const minR = Math.min(start[0], r);
      const maxR = Math.max(start[0], r);
      const minC = Math.min(start[1], c);
      const maxC = Math.max(start[1], c);
      const newSelection: [number, number][] = [];
      for (let ri = minR; ri <= maxR; ri++) {
        for (let ci = minC; ci <= maxC; ci++) {
          newSelection.push([ri, ci]);
        }
      }
      setSelectedCells(newSelection);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const isCellSelected = (r: number, c: number) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c);

  // Merge selected cells
  const mergeCells = () => {
    if (selectedCells.length < 2) return;
    const minR = Math.min(...selectedCells.map(([r]) => r));
    const maxR = Math.max(...selectedCells.map(([r]) => r));
    const minC = Math.min(...selectedCells.map(([, c]) => c));
    const maxC = Math.max(...selectedCells.map(([, c]) => c));

    const newRows = rows.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === minR && ci === minC) {
          // Top-left cell gets the span
          const combinedContent = selectedCells
            .map(([r, c]) => rows[r]?.[c]?.content || '')
            .filter(Boolean)
            .join(' ');
          return {
            ...cell,
            content: combinedContent || cell.content,
            rowSpan: maxR - minR + 1,
            colSpan: maxC - minC + 1,
          };
        }
        if (ri >= minR && ri <= maxR && ci >= minC && ci <= maxC) {
          // Other cells in the range are marked as merged
          return { ...cell, content: '', merged: true, rowSpan: 1, colSpan: 1 };
        }
        return cell;
      })
    );
    updateRows(newRows);
    setSelectedCells([]);
  };

  // Unmerge cells
  const unmergeCells = () => {
    const newRows = rows.map((row) =>
      row.map((cell) => ({
        ...cell,
        rowSpan: 1,
        colSpan: 1,
        merged: false,
      }))
    );
    updateRows(newRows);
    setSelectedCells([]);
  };

  return (
    <div className="rounded-xl" onMouseUp={handleMouseUp}>
      {/* Table Controls */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button onClick={addRow} className="btn-outline text-xs py-1.5 px-3">
          <Plus className="w-3 h-3" /> Row
        </button>
        <button onClick={removeRow} className="btn-outline text-xs py-1.5 px-3">
          <Minus className="w-3 h-3" /> Row
        </button>
        <div className="w-px h-5 bg-white/[0.1]" />
        <button onClick={addColumn} className="btn-outline text-xs py-1.5 px-3">
          <Plus className="w-3 h-3" /> Col
        </button>
        <button onClick={removeColumn} className="btn-outline text-xs py-1.5 px-3">
          <Minus className="w-3 h-3" /> Col
        </button>
        {selectedCells.length >= 2 && (
          <>
            <div className="w-px h-5 bg-[#00FF9C]/10" />
            <button onClick={mergeCells} className="btn-outline text-xs py-1.5 px-3 text-[#00FF9C] border-[#00FF9C]/30 hover:bg-[#00FF9C]/10 transition-all">
              <Merge className="w-3 h-3" /> Merge
            </button>
          </>
        )}
        {rows.some((row) => row.some((cell) => (cell.rowSpan || 1) > 1 || (cell.colSpan || 1) > 1)) && (
          <button onClick={unmergeCells} className="btn-outline text-xs py-1.5 px-3 text-warning border-warning/30">
            <X className="w-3 h-3" /> Unmerge All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#00FF9C]/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <table className="w-full border-collapse">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  if (cell.merged) return null;
                  return (
                    <td
                      key={ci}
                      rowSpan={cell.rowSpan || 1}
                      colSpan={cell.colSpan || 1}
                      onMouseDown={(e) => handleCellMouseDown(ri, ci, e)}
                      onMouseEnter={() => handleCellMouseEnter(ri, ci)}
                      className={`border border-[#00FF9C]/10 p-0 min-w-[100px] transition-colors ${
                        isCellSelected(ri, ci) ? 'bg-[#00FF9C]/10 outline outline-1 outline-[#00FF9C]/30 shadow-[inset_0_0_10px_rgba(0,255,156,0.1)]' : ''
                      }`}
                    >
                      <input
                        value={cell.content}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="w-full bg-transparent border-none outline-none px-3 py-2.5 text-sm text-[#A8FFDF] placeholder:text-[#7C8B93]/30"
                        placeholder="..."
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[#7C8B93]/40 text-xs mt-2 italic px-1">
        Tip: Click & drag to select cells, then merge them. {rows.length} × {rows[0]?.length || 0}
      </p>
    </div>
  );
};

export default TableBlock;
