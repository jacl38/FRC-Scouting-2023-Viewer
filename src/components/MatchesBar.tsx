import { Link } from "react-router-dom"
import { MatchData, WinResult } from "../objectModel"
import { ColorUtils, tw } from "../utility"
import { Button } from "./Button";
import { useState } from "react";

const styles = {
	outerContainer: tw("w-full flex items-stretch"),
	barCell: tw(
		"w-full",
		"font-bold text-lg text-center",
		"m-0.5",
		"flex flex-col justify-center",
		"transition-all duration-200",
		"hover:text-sm"
	),
	cellPosition: (index: number, max: number) => {
		if(index == 0) return "rounded-r-md rounded-l-3xl";
		if(index == max - 1) return "rounded-r-3xl rounded-l-md"
		return "rounded-md";
	},
	winCell: tw(
		ColorUtils.hoverableGradient({
			hovered: { shade: "dark", color: "green" },
			normal: { shade: "mid", color: "emerald" }
		})
	),
	loseCell: tw(
		ColorUtils.hoverableGradient({
			hovered: { shade: "dark", color: "amber" },
			normal: { shade: "mid", color: "orange" }
		}),
		"text-white"),
	tieCell: tw(
		ColorUtils.hoverableGradient({
			hovered: { shade: "dark", color: "yellow" },
			normal: { shade: "mid", color: "amber" }
		}))
}

const sortMatches = (a: WinResult, b: WinResult) => {
	const aNum = a == WinResult.victory ? 1 : (a == WinResult.defeat ? -1 : 0);
	const bNum = b == WinResult.victory ? 1 : (b == WinResult.defeat ? -1 : 0);

	return bNum - aNum;
}

const resultToColor = {
	"victory": styles.winCell,
	"defeat": styles.loseCell,
	"tie": styles.tieCell
}

export const MatchesBar = (props: {
	matchDetails: { matchNumber: number, winResult: WinResult }[]
}) => {
	const [sorted, setSorted] = useState(false);

	return <div className={styles.outerContainer}>
		{(sorted
			? [...props.matchDetails].sort((a, b) => sortMatches(a.winResult, b.winResult))
			: props.matchDetails).map((match, index) =>
			<Link
				key={`match-index-${index}`}
				to={`/?m=${match.matchNumber}`}
				className={`
					${styles.barCell}
					${resultToColor[match.winResult]}
					${styles.cellPosition(index, props.matchDetails.length)}
				`}
			>
				{match.matchNumber}
			</Link>
		)}
		<div className="ml-4">
			<Button innerShadow extraStyle="aspect-square" text="↹" selected={sorted} onClick={() => { setSorted(!sorted); }}/>
		</div>
	</div>
}