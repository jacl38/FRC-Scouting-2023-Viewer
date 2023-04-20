import { useEffect, useState } from "react";
import { MatchData, RowType, TeamStats } from "../objectModel";
import { cache, statsByTeamNumber } from "../dataCache";
import { LoadingMessage, LoadingSpinner } from "../components/LoadingMessage";
import { tw } from "../utility";
import { ItemList } from "../components/ItemList";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink } from "../components/ExternalLink";
import { Table } from "../components/Table";
import { MatchesBar } from "../components/MatchesBar";

const styles = {
	outerContainer: tw("flex animate-fadeIn"),
	separator: tw("border-zinc-400 dark:border-zinc-700 my-4"),
	teamInfo: {
		container: tw(
			`w-full`,
			`flex flex-col items-center`,
			`py-4 px-8`,
		),
		numberHeading: tw("underline text-lg"),
		itemContainer: tw(
			"rounded-xl",
			"bg-zinc-150 dark:bg-zinc-800",
			"w-full py-4 px-12 mx-6 mt-6",
			"text-center",
			"transition-all"
		),
		scoreStats: {
			wrapper: "flex flex-col items-center space-y-4 mt-4",
			row: "relative flex items-center"
		}
	}
};

export const TeamViewer = () => {

	const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
	const [tbaTeamData, setTbaTeamData] = useState(null);
	const [selectedTeam, setSelectedTeam] = useState(0);
	const navigate = useNavigate();
	
	const selectTeam = async (teamNumber: number) => {
		setSelectedTeam(teamNumber);
		navigate(`/team-viewer?t=${teamNumber}`, { replace: false });
		await fetch(`https://www.thebluealliance.com/api/v3/team/frc${teamNumber}`, {
			headers: {
			}
		}).then(response => response.json().then(result => setTbaTeamData(result)));
	}
	
	const getTeamByNumber = (teamNumber: number) => teamStats.find(t => t.teamNumber == teamNumber);

	const getSelectedTeam = () => getTeamByNumber(selectedTeam);

	const reduceNotesDuplicates = (notes?: string[]) => {
		if(notes == undefined) return [];
		const reduced = [...new Set(notes?.map(note => note.trim()))];
		return reduced.map(note => ({
			note: note,
			count: notes?.filter(n => n == note).length
		}));
	}

	const scoreRowToTableRow = (row: RowType) => {
		const scoreRow = getSelectedTeam()?.teleop.scoreGrid[row];
		const formatItem = (item?: number) => item?.toLocaleString(undefined, { maximumSignificantDigits: 3 });
		return [
			row.charAt(0).toUpperCase() + row.substring(1),
			scoreRow?.rawTotal,
			formatItem(scoreRow?.mean),
			formatItem(scoreRow?.median),
			formatItem(scoreRow?.variance),
			formatItem(scoreRow?.stdev),
			formatItem(scoreRow?.rawLinkTotal),
			formatItem(scoreRow?.meanLinks)
		];
	}

	useEffect(() => {

		if(cache.storedData == null) {
			(async () => {
				await fetch("/data")
					.then((response) => {
						response.json().then((result) => {
							const retrievedMatches = result.stats as TeamStats[];
							cache.storedData = result as {
								matches: MatchData[],
								teamList: number[],
								stats: TeamStats[]
							}
							setTeamStats(retrievedMatches);
						});
					});
			})().catch(console.error);
		} else {
			setTeamStats(cache.storedData.stats);
		}
	}, []);

	return <div className="animate-fadeIn">
		{teamStats.length == 0 ? <LoadingMessage message="Loading team stats..." /> : <>
			<div className={styles.outerContainer}>
				<div className="h-full">
					<ItemList
						title="Teams"
						items={teamStats.map(stats => stats.teamNumber).map(teamNumber => 
							<Button text={`${teamNumber}`} onClick={() => selectTeam(teamNumber)} selected={selectedTeam == teamNumber}/>
						)}/>
				</div>

				<div className={styles.teamInfo.container}>
					{selectedTeam > 0 ? <>

						<ExternalLink
							linkStyle={styles.teamInfo.numberHeading}
							tooltipStyle="after:content-['View_team_on_The_Blue_Alliance']"
							linkText={`Team ${selectedTeam}`}
							url={`https://www.thebluealliance.com/team/${selectedTeam}`} />

						<div className="h-4">
							{
								tbaTeamData == null ? "" : (
									tbaTeamData["team_number"] != selectedTeam
									? <LoadingSpinner />
									: <p className="italic">{tbaTeamData["nickname"]}</p>
								)
							}
						</div>

						<div className={styles.teamInfo.itemContainer}>
							<p className="text-xl">General stats</p>

							<div className="pb-6 pt-4">
								<MatchesBar matchDetails={
									statsByTeamNumber(selectedTeam)?.matches.played.map(match => ({
										matchNumber: match.matchNumber,
										winResult: match.winResult
									})) ?? []
								} />

								<div className="mt-4 flex justify-center">
									<Table
										headings={["Matches Played", "Losses", "Ties", "Wins", "Win Percent"]}
										rows={[
											[
												getSelectedTeam()?.matches.numberPlayed,
												getSelectedTeam()?.matches.lost,
												getSelectedTeam()?.matches.tie,
												getSelectedTeam()?.matches.won,
												getSelectedTeam()?.matches.winPercent.toLocaleString(undefined, {
													style: "percent",
													maximumFractionDigits: 2
												})]
										]}
									/>
								</div>
							</div>

							<hr className={styles.separator} />

							<p className="text-xl">Score stats</p>

							<div className={styles.teamInfo.scoreStats.wrapper}>
								<div className={styles.teamInfo.scoreStats.row}>
									<Table firstIsRowLabel
										headings={[
											"Total Scored",
											"Mean",
											"Median",
											"Variance",
											"Standard Deviation",
											"Weighted Total Links",
											"Weighted Mean Links"
										]}
										rows={[
											scoreRowToTableRow("top"),
											scoreRowToTableRow("mid"),
											scoreRowToTableRow("low")
										]}
									/>
								</div>
							</div>

							<hr className={styles.separator} />

							<p className="text-xl">Misc stats</p>

							<div className="flex mt-4">
								<div className="w-1/2 pr-2">
									<ItemList
										title="Notes"
										items={
											reduceNotesDuplicates((getSelectedTeam()?.notes ?? []).length > 0 ? getSelectedTeam()?.notes : ["No notes were collected for this team."])
												.map(note => <p>
													<span>{note.note}</span>
													<span className="font-bold text-zinc-500">{note.count > 1 ? ` ×${note.count}` : ""}</span>
												</p>)
										}
									/>
								</div>
								<div className="w-1/2 pl-2">
									<Table
										headings={["Auto Mobility %", "Auto Charge %", "End Charge %"]}
										rows={[
											[
												getSelectedTeam()?.auto.mobilityPercent.toLocaleString(undefined, {
													style: "percent",
													maximumFractionDigits: 2
												}),
												getSelectedTeam()?.auto.chargePercent.toLocaleString(undefined, {
													style: "percent",
													maximumFractionDigits: 2
												}),
												getSelectedTeam()?.end.chargePercent.toLocaleString(undefined, {
													style: "percent",
													maximumFractionDigits: 2
												}),
											]
										]}
									/>
								</div>
							</div>
						</div>
						
					</> : <p className="text-lg">Select a team</p>}
				</div>
			</div>
		</>}
	</div>
}