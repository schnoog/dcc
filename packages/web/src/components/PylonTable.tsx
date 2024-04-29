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

const columnHelper = createColumnHelper<DcsJs.Launcher>();

export function PylonTable({ items }: { items: Record<string, DcsJs.Launcher> }) {
	const values = React.useMemo(() => Object.values(items), [items]);
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
		data: values,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div>
			<Table
				table={table}
				cell={(cell) => {
					return (
						<td key={cell.id}>
							<a href={`/database/pylons/${cell.row.original.name}`} className="block h-full w-full p-2">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</a>
						</td>
					);
				}}
			/>
		</div>
	);
}
