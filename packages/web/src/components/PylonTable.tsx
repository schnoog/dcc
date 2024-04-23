import * as React from "react";
import * as DcsJs from "../../../libs/dcsjs/src";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "./Table";

const columnHelper = createColumnHelper<DcsJs.Launcher>();

export function PylonTable({
  items,
}: {
  items: Record<string, DcsJs.Launcher>;
}) {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("displayName", {
        cell: (info) => info.getValue(),
        header: "Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("type", {
        cell: (info) => info.getValue(),
        header: "Type",
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
