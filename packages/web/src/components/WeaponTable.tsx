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
import { escapeRegExp } from "../lib/utils";
import { cn } from "../lib/utils";

const columnHelper = createColumnHelper<DcsJs.Weapon>();

export function WeaponTable({ items }: { items: Record<string, DcsJs.Weapon> }) {
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
				meta: {
					filterVariant: "select",
				},
			}),
			columnHelper.accessor("year", {
				cell: (info) => info.getValue(),
				header: "Year",
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
		<Table
			table={table}
			cell={(cell, i) => {
				return (
					<td key={cell.id} className={cn({ "text-primary-light underline": i === 0 })}>
						<a href={`/database/weapons/${escapeRegExp(cell.row.original.name)}`} className="block h-full w-full p-2">
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</a>
					</td>
				);
			}}
		/>
	);
}
