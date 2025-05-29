import React from 'react';
import StatusBadge from './StatusBadge';

interface TableProps {
  headers: string[];
  data: any[];
  sortConfig?: { key: string; direction: 'ascending' | 'descending' } | null;
  onSort?: (key: string) => void;
}

const Table: React.FC<TableProps> = ({ headers, data, sortConfig, onSort }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort && onSort(header)}
            >
              {header}
              {sortConfig?.key === header && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index} className="hover:bg-gray-50">
            {Object.values(row).map((cell, cellIndex) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
  {typeof cell === 'string' && cell.match(/^(Present|Absent|Half-day|Leave)$/) ? (
    <StatusBadge status={cell} size="sm" />
  ) : (
    <span>{String(cell)}</span>
  )}
</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;