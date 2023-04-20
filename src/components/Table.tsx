import { useEffect, useState } from "react";
import { tw } from "../utility"


const styles = {
	outerContainer: tw(
		"rounded-xl overflow-hidden",
		"border-2 border-zinc-300 dark:border-zinc-700",
		"shadow-sm dark:shadow-none",
		"transition-all",
		"h-fit max-h-full",
		"overflow-y-scroll"
	),
	tableContainer: tw(
		"w-full",
		"bg-zinc-200 dark:bg-zinc-900",
		"dark:border-zinc-700",
		"transition-all",
		"h-fit max-h-full",
		"overflow-y-scroll",
		"relative"
	),
	headingRow: tw("sticky top-0"),
	headingCell: tw(
		"bg-zinc-300 dark:bg-zinc-700",
		"select-none cursor-pointer",
		"transition-all"
	),
	cell: tw("px-4 py-2"),
	labelCell: tw(
		`font-bold`,
		`bg-zinc-300 dark:bg-zinc-700`,
		`transition-all`
	),
	sortedCell: tw("bg-white bg-opacity-[.02]")
}

export const Table = (props: {
	sortable?: boolean,
	firstIsRowLabel?: boolean,
	headings: string[],
	rows: any[][],
	styles?: string[],
	conditionalStyles?: (value: any) => string | undefined
}) => {
	const [sortedColumn, setSortedColumn] = useState(0);
	const [sortDirection, setSortDirection] = useState(false);

	const sortByColumn = (column: number) => {
		if(column == sortedColumn) {
			setSortDirection(!sortDirection);
		} else {
			setSortDirection(true);
			setSortedColumn(column);
		}
	}

	return <div className={styles.outerContainer}>
		<table className={styles.tableContainer}>
			<thead>
				<tr className={styles.headingRow}>
					{((props.firstIsRowLabel ? [""] : []).concat(props.headings)).map((heading, index) =>
						<th key={`table-heading-${index}`}
							onClick={() => { if(props.sortable) sortByColumn(index); }}
							className={`
							${props.styles?.[index]}
							${styles.cell}
							${styles.headingCell}
						`}>{heading}{(index != sortedColumn || !props.sortable) ? "" : (sortDirection ? <> &#10515;</> : <> &#10514;</>)}</th>
					)}
				</tr>
			</thead>
	
			<tbody>
				{(props.sortable ? props.rows.sort((a, b) => String(a[sortedColumn]).localeCompare(String(b[sortedColumn]), undefined, { numeric: true, sensitivity: "base" }) * (sortDirection ? -1 : 1))
				: props.rows).map((row, rowNumber) =>
					<tr key={`row-${rowNumber}`}>
						{row.map((cell, index) =>
							<td key={`table-${rowNumber}-${index}`}
								className={`
								${props.firstIsRowLabel && index == 0 ? styles.labelCell : ""}
								${props.styles?.[index]}
								${props.conditionalStyles ? props.conditionalStyles(cell) : ""}
								${styles.cell}
								${index == sortedColumn && props.sortable ? styles.sortedCell : ""}
							`}>{cell}</td>
						)}
					</tr>
				)}
			</tbody>
		</table>
	</div>
}