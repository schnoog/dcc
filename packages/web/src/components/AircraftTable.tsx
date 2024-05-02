import * as React from "react";
import * as DcsJs from "../../../libs/dcsjs/src";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Table } from "./Table";
import { cn } from "../lib/utils";

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
				meta: {
					filterVariant: "select",
				},
			}),
			columnHelper.accessor("controllable", {
				cell: (info) => (info.getValue() ? "Yes" : ""),
				header: "Controllable",
				footer: (info) => info.column.id,
				meta: {
					filterVariant: "select",
				},
			}),
			columnHelper.accessor("isHelicopter", {
				cell: (info) => (info.getValue() ? "Yes" : ""),
				header: "Helicopter",
				footer: (info) => info.column.id,
				meta: {
					filterVariant: "booleanSelect",
				},
			}),
		],
		[],
	);

	const table = useReactTable({
		columns,
		data: values,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	console.log("render");
	return (
		<Table
			table={table}
			cell={(cell, i) => {
				return (
					<td
						key={cell.id}
						className={cn({ "text-primary-light underline": i === 0, "hidden sm:block": (i ?? 0) > 1 })}
					>
						<a href={`/database/aircrafts/${cell.row.original.name}`} className="block h-full w-full p-2">
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</a>
					</td>
				);
			}}
		/>
	);
});
