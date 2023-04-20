import { tw } from "../utility"

const styles = {
	container: tw(
		"flex flex-col shrink-0",
		"overflow-hidden",
		"dark:bg-zinc-700 bg-zinc-300",
		"dark:text-gray-300",
		"border-2",
		"dark:border-zinc-700 border-zinc-300",
		"shadow-sm dark:shadow-none",
		"rounded-2xl",
		"h-fit max-h-full",
		"transition-all"
	),
	title: tw(
		"px-8 py-1",
		"text-center",
		"text-lg font-semibold"
	),
	content: tw(
		"overflow-y-scroll",
		"shrink",
		"space-y-2 py-2 px-2",
		"shadow-inner",
		"dark:bg-zinc-800 bg-zinc-150",
		"transition-all",
		"h-full",
		"text-black dark:text-white"
	)
}

export const ItemList = (props: { extraStyles?: { container?: string }, title: string, items: JSX.Element[] }) => {
	return <div className={tw(styles.container, props.extraStyles?.container ?? "")}>

		<p className={styles.title}>{props.title}</p>

		<div className={styles.content}>
			{props.items.map((item, index) => <div key={`item-${index}`}>{item}</div>)}
		</div>
	</div>
}