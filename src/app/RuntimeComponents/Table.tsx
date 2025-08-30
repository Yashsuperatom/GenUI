"use client";
import React from "react";

type TableProps = {
  columns: string[];
  data: (string | number)[][];
};

export function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto border rounded-2xl shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, i) => (
              <th key={i} className="p-2 text-left text-sm font-semibold border-b">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="p-2 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
