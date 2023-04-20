import { tw } from "../utility";

const styles = {
	tooltip: tw(
		`after:absolute`,
		`after:translate-x-1/4 after:-translate-y-16 after:hover:-translate-y-20`,
		`after:opacity-0 after:blur-sm after:hover:blur-none after:hover:opacity-100`,
		`after:origin-left`,
		`after:scale-110 after:hover:scale-100`,
		`after:transition-all after:duration-100`,
		`after:p-2 after:px-4`,
		`after:rounded-full after:rounded-bl-none`,
		`after:shadow-lg`,
		`after:font-semibold`,
		`after:bg-gradient-to-bl after:from-indigo-500 after:to-blue-900`,
		`after:text-white`)
}

export const ExternalLink = (props: { linkStyle?: string, linkText: string, url: string, tooltipStyle?: string }) => {
	// const tooltipClassName = styles.tooltip + " " + props.tooltipStyle;
	return <a target="_blank" href={props.url}
		className={`${styles.tooltip} ${props.tooltipStyle}`}>
		<div className="flex items-center relative">
			<p className={props.linkStyle}>{props.linkText}</p>
			<img className="scale-[0.4] opacity-50 invert dark:invert-0 transition-all absolute -right-10" src="./assets/img/open.svg"/>
		</div>
	</a>
}