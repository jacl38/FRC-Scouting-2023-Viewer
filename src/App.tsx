import { Link, Outlet } from "react-router-dom";
import { useDarkMode } from "./hooks/useDarkMode";
import { tw } from "./utility";

const styles = {
	wrapper: tw(
		`bg-zinc-200 dark:bg-neutral-950`,
		`transition-all duration-75`,
		`dark:text-gray-300`,
		`h-full`,
		`flex`,
		`transition-all`,
		`overflow-scroll`
	),
	navigation: tw(
		`bg-zinc-800 dark:bg-zinc-900`,
		`text-slate-300`,
		`h-full`,
		`px-4 py-8`,
		`rounded-r-3xl`,
		`flex flex-col items-center`,
		`space-y-8`,
		`transition-all`
	),
	itemButton: {
		wrapper: tw(`flex flex-col items-center opacity-60 hover:opacity-100 group transition-opacity duration-75 text-md whitespace-nowrap`),
		icon: tw(`scale-75 group-hover:bg-[#ffffff20] bg-opacity-0 rounded-full p-2 -m-2`)
	},
	body: {
		wrapper: tw("w-full flex flex-col"),
		heading: {
			text: tw("text-3xl font-semibold"),
			wrapper: tw("px-6 py-8")
		},
		content: {
			wrapper: tw(
				`h-full`,
				`mx-4 p-4`,
				`bg-zinc-50 dark:bg-zinc-900`,
				`rounded-2xl`,
				`text-neutral-900 dark:text-neutral-400`,
				`overflow-y-scroll mb-4`,
				`overflow-hidden`,
				`shadow-lg dark:shadow-none`,
				`transition-all`
			)
		}
	}
};

const IconLink = (props: { to: string, iconPath: string, label: string }) => {
	return <Link to={props.to} className={styles.itemButton.wrapper}>
		<img className={styles.itemButton.icon} src={props.iconPath} />
		<p>{props.label}</p>
	</Link>
}

export const App = () => {
	const [dark, setDark] = useDarkMode();

	return ( <>
		<div className={styles.wrapper}>
			<nav className={styles.navigation}>

				<IconLink to="/" label="Match Viewer" iconPath="./assets/img/flag.svg" />
				<IconLink to="/team-viewer" label="Team Stats" iconPath="./assets/img/number.svg" />
				<IconLink to="/compare" label="Compare" iconPath="./assets/img/compare.svg" />

				<hr className="h-px border-white border-opacity-50 w-full" />

				<div className="flex-1 flex flex-col justify-end">
					<button className={styles.itemButton.wrapper} onClick={() => { setDark(!dark); }}>
						<img className={styles.itemButton.icon} src={dark ? "./assets/img/moon.svg" : "./assets/img/sun.svg"} />
						<p>{dark ? "Light Mode" : "Dark Mode"}</p>
					</button>
				</div>
				
			</nav>
			
			<main className={styles.body.wrapper}>
				<header className={styles.body.heading.wrapper}>
					<h1 className={styles.body.heading.text}>Scouting Data Viewer</h1>
				</header>
				<div className={styles.body.content.wrapper}>
					<Outlet />
				</div>
			</main>
		</div>
	</> );
}