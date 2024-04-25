import { flexRender } from "@tanstack/react-table";
import type { Cell, Column, CoreColumn, Table as TanTable } from "@tanstack/table-core";
import * as React from "react";

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

function Filter<DataType>({ column }: { column: Column<DataType, unknown> }) {
	const columnFilterValue = column.getFilterValue();

	return (
		<DebouncedInput
			className="w-36 rounded border text-black shadow"
			onChange={(value) => column.setFilterValue(value)}
			placeholder={`Search...`}
			type="text"
			value={(columnFilterValue ?? "") as string}
		/>
	);
}

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
									{flexRender(header.column.columnDef.header, header.getContext())}
									{header.column.getCanFilter() ? (
										<div>
											<Filter column={header.column} />
										</div>
									) : null}
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
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
