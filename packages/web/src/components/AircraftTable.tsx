import * as React from "react";
import * as DcsJs from "../../../libs/dcsjs/src";
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Table } from "./Table";

const columnHelper = createColumnHelper<DcsJs.AircraftDefinition>();

export const AircraftTable = React.memo(function AircraftTable({
	items,
}: {
	items: Record<DcsJs.AircraftType, DcsJs.AircraftDefinition>;
}) {
	const values = React.useMemo(() => Object.values(items), [items]);
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
		data: values,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	console.log("render");
	return (
		<div>
			<input className="font-lg border-block color-midnight border p-2 shadow" placeholder="Search all columns..." />

			<Table table={table} />
		</div>
	);
});
