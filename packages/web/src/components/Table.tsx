import { flexRender } from "@tanstack/react-table";
import type { Cell, Table as TanTable } from "@tanstack/table-core";
import * as React from "react";

export type TableProps<DataType> = {
  table: TanTable<DataType>;
  cell?: (cell: Cell<DataType, unknown>) => React.ReactNode;
};
export function Table<DataType>({ cell, table }: TableProps<DataType>) {
  return (
    <table className="w-full table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} className="p-2 text-start">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {cell == null
                ? row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })
                : row.getVisibleCells().map(cell)}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
