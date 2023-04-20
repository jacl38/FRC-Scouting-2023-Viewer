import { tw } from "../utility"

const styles = {
	button: tw(
		"border-2 border-white",
		"block",
		"px-4 py-2",
		"w-full",
		"rounded-full",
		"bg-slate-500 bg-opacity-0",
		"hover:bg-opacity-10",
		"transition-all duration-75",
		
	)
}

export const Button = (props: { text: string, onClick?: () => void, selected?: boolean, extraStyle?: string, innerShadow?: boolean }) => {
	return <button
		onClick={props.onClick}
		className={`
			${props.innerShadow ? "shadow-inner dark:shadow-none" : "shadow-none"}
			${props.extraStyle}
			${props.selected ? "border-opacity-10 bg-opacity-20" : "border-opacity-0"}
			${styles.button}
		`}>
	{props.text}
</button>
}