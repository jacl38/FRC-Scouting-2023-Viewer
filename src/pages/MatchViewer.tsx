import { useEffect, useState } from "react";
import { AllianceStats, AllianceType, ChargeType, MatchData, MatchStats, TeamStats, WinResult } from "../objectModel";
import { cache, matchByMatchNumber } from "../dataCache";
import { LoadingMessage } from "../components/LoadingMessage";
import { Button } from "../components/Button";
import { ItemList } from "../components/ItemList";
import { tw } from "../utility";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "../components/Table";

const styles = {
	outerContainer: tw("flex animate-fadeIn"),
	separator: tw("border-zinc-400 dark:border-zinc-700 my-4"),
	matchInfo: {
		container: tw(
			`w-full`,
			`flex flex-col items-center`,
			`py-4 px-8`
		),
		numberHeading: tw("underline text-lg"),
		itemContainer: tw(
			"w-full h-full grow",
			"overflow-y-scroll",
			"rounded-xl",
			"flex flex-col items-center",
			"bg-zinc-150 dark:bg-zinc-800",
			"py-4 px-12 mt-4",
			"transition-all"
		)
	}
};

const formatDate = (date?: Date): string => {
	if(date == undefined) return "unknown date/time";
	return new Intl.DateTimeFormat("en-us", { dateStyle: "full", timeStyle: "short" }).format(new Date(date));
}

export const MatchViewer = () => {
	const [matchData, setMatchData] = useState<MatchData[]>([]);
	const [matchStats, setMatchStats] = useState<MatchStats[]>([]);
	const [selectedMatch, setSelectedMatch] = useState(0);

	const navigate = useNavigate();

	const selectedRed = matchData.find(match => match.matchNumber == selectedMatch && match.alliance == AllianceType.red);
	const selectedBlue = matchData.find(match => match.matchNumber == selectedMatch && match.alliance == AllianceType.blue);

	const getSelectedMatch = (alliance: AllianceType) => matchData.find(m => m?.alliance == alliance && m?.matchNumber == selectedMatch);
	const getSelectedMatchStats = () => matchStats.find(m => m?.matchNumber == selectedMatch);

	const selectMatch = (matchNumber: number) => {
		setSelectedMatch(matchNumber);
		navigate(`/?m=${matchNumber}`, { replace: false });
	};

	useEffect(() => {
		const openedMatchNumber = parseInt(new URLSearchParams(window.location.search).get("m") ?? "");
		if(openedMatchNumber != selectedMatch) setSelectedMatch(openedMatchNumber);
		if(cache.storedData == null) {
			(async () => {
				await fetch("/data")
					.then((response) => {
						response.json().then((result) => {
							const retrievedMatches = result.matches as MatchData[];
							const retrievedMatchStats = result.stats.matches as MatchStats[];
							cache.storedData = result as {
								matches: MatchData[],
								teamList: number[],
								stats: {
									teams: TeamStats[],
									matches: MatchStats[]
								}
							}
							setMatchData(retrievedMatches);
							setMatchStats(retrievedMatchStats);
						});
					});
			})().catch(console.error);
		} else {
			setMatchData(cache.storedData.matches);
			setMatchStats(cache.storedData.stats.matches);
		}
	}, []);
	
	if(matchData.length == 0) {
		return <div className="h-full flex flex-col items-center justify-center animate-fadeIn">
			<LoadingMessage message="Loading match stats..." />
		</div>
	}

	const AllianceDataComponent = (props: {alliance: AllianceType}) => {
		const allianceData = props.alliance == AllianceType.blue
			? getSelectedMatchStats()?.blue
			: getSelectedMatchStats()?.red;

		let teamDatas: any[] = [];
		if(allianceData?.alliance != undefined) {
			teamDatas = [
				{
					...getSelectedMatch(props.alliance)?.team1Data,
					scores: allianceData?.scoresPerTeam[0],
					points: allianceData?.pointsPerTeam[0],
					links: allianceData?.linksPerTeam[0]
				},
				{
					...getSelectedMatch(props.alliance)?.team2Data,
					scores: allianceData?.scoresPerTeam[1],
					points: allianceData?.pointsPerTeam[1],
					links: allianceData?.linksPerTeam[1]
				},
				{
					...getSelectedMatch(props.alliance)?.team3Data,
					scores: allianceData?.scoresPerTeam[2],
					points: allianceData?.pointsPerTeam[2],
					links: allianceData?.linksPerTeam[2]
				}
			];
		} else {
			const otherMatchStats = props.alliance == AllianceType.blue
				? getSelectedMatchStats()?.red
				: getSelectedMatchStats()?.blue;
			if(otherMatchStats?.alliance != undefined) {
				if(otherMatchStats.winResult == WinResult.tie) (allianceData as AllianceStats)["winResult"] = WinResult.tie;
				if(otherMatchStats.winResult == WinResult.victory) (allianceData as AllianceStats)["winResult"] = WinResult.defeat;
				if(otherMatchStats.winResult == WinResult.defeat) (allianceData as AllianceStats)["winResult"] = WinResult.victory;
			}
		}

		const items = allianceData?.alliance == undefined ? [
			<p className="text-center text-lg italic text-gray-500">No scouting data found for this match.</p>
		] : [
			<Table firstIsRowLabel
				key={`${props.alliance}data`}
				headings={["Auto Charge", "End Charge", "Scores", "Points", "Links"]}
				styles={["text-right", "text-center", "text-center", "text-right", "text-right", "text-right"]}
				conditionalStyles={(value) => {
					if(value == "none") return "text-gray-500 italic";
				}}
				rows={
					teamDatas.map(team => [
						<Link
							to={`/team-viewer/?t=${team.teamNumber}`}
							className="underline"
						>
							<p className="hover:-translate-y-0.5 hover:scale-105 transition-all">{team.teamNumber}</p>
						</Link>,

						team.autoCharge,
						team.endCharge,
						team.scores,
						team.points,
						team.links?.toLocaleString(undefined, { maximumSignificantDigits: 2 })
					])
				}
			/>,
			// Coopertition, activation, sustainability, RP
			<hr className={styles.separator} />,
			<Table firstIsRowLabel
				key={`${props.alliance}stats`}
				headings={["Match Stats", "", "", "", ""]}
				styles={["text-right"]}
				rows={[
					["Coopertition", allianceData?.coop ? "Yes" : "No"],
					["Activation", allianceData?.activation ? "Yes" : "No"],
					["Sustainability", allianceData?.sustainability ? "Yes" : "No"],
					["Ranking Points", allianceData?.rankingPoints],
				]}
			/>
		];

		return <div className="w-full animate-fadeIn">
			<ItemList
				title={`${props.alliance.charAt(0).toUpperCase() + props.alliance.substring(1)} ${allianceData?.winResult != undefined ? allianceData?.winResult : "unknown"}`}
				extraStyles={{
					container: tw(
						props.alliance == AllianceType.red ? "!bg-red-700" : "!bg-blue-700",
						props.alliance == AllianceType.red ? "!border-red-700" : "!border-blue-700",
						"dark:saturate-50 saturate-[0.75]",
						"text-white",
						"transition-all"
					)
				}}
				items={items}
			/>
		</div>
	}

	const matchDataComponent = () => {

		return <div className={styles.matchInfo.itemContainer}>
			<div className="w-full flex max-lg:flex-col lg:space-x-4 max-lg:space-y-4">
				<AllianceDataComponent alliance={AllianceType.red} />
				<AllianceDataComponent alliance={AllianceType.blue} />
			</div>
		</div>
	}

	return <div className="animate-fadeIn h-full">

		<div className="flex h-full space-x-4">
			<ItemList
				title="Matches"
				items={[...new Set(matchData.map(match => match.matchNumber))].map(matchNumber =>
					<Button
						text={`Match ${matchNumber}`}
						onClick={() => selectMatch(matchNumber)}
						selected={selectedMatch == matchNumber}/>
			)}/>
			<div className="w-full">
				{
					selectedMatch > 0
					? <div className="flex flex-col items-center h-full">
						<p className="text-lg">Match {selectedMatch}</p>
						<p className="italic">on {formatDate(getSelectedMatch(AllianceType.red)?.timestamp)}</p>

						{matchDataComponent()}
					</div>
					: <p className="text-lg text-center">Select a match</p>
				}
			</div>

		</div>
	</div>
}