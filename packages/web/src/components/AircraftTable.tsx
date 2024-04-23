import * as React from "react";
import * as DcsJs from "../../../libs/dcsjs/src";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "./Table";

const columnHelper = createColumnHelper<DcsJs.AircraftDefinition>();

export function AircraftTable({
  items,
}: {
  items: Record<DcsJs.AircraftType, DcsJs.AircraftDefinition>;
}) {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("display_name", {
        cell: (info) => info.getValue(),
        header: "Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("era", {
        cell: (info) => info.getValue(),
        header: "Era",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("isHelicopter", {
        cell: (info) => (info.getValue() ? "Yes" : ""),
        header: "Helicopter",
        footer: (info) => info.column.id,
      }),
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: Object.values(items),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table table={table} />
    </div>
  );
}
