import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchData, RowType, TeamStats as TeamStats } from "../objectModel";
import { cache, statsByTeamNumber } from "../dataCache";
import { ItemList } from "../components/ItemList";
import { LoadingMessage, LoadingSpinner } from "../components/LoadingMessage";
import { Button } from "../components/Button";
import { ExternalLink } from "../components/ExternalLink";
import { tw } from "../utility";
import { MatchesBar } from "../components/MatchesBar";
import { Table } from "../components/Table";

const styles = {
	separator: tw("border-zinc-400 dark:border-zinc-700 w-full"),
	teamInfo: {
		numberHeading: tw("underline text-lg"),
		itemContainer: tw(
			"w-full h-full grow",
			"overflow-y-scroll",
			"rounded-xl",
			"flex flex-col items-center",
			"bg-zinc-150 dark:bg-zinc-800",
			"py-4 px-12 mt-4",
			"transition-all"
		),
		categoryContainer: tw(
			"w-full h-full",
			"text-center",
			"my-8 space-y-4",
			"animate-fadeIn"
		),
		scoreStats: {
			wrapper: "flex flex-col items-center space-y-4 mt-4",
			row: "relative flex items-center"
		}
	}
}

export const TeamViewer = () => {

	const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
	const [tbaTeamData, setTbaTeamData] = useState(null);
	const [selectedTeam, setSelectedTeam] = useState(0);
	const navigate = useNavigate();
	
	const selectTeam = async (teamNumber: number) => {
		setSelectedTeam(teamNumber);
		navigate(`/team-viewer?t=${teamNumber}`, { replace: false });
	}

	useEffect(() => {
		const openedTeamNumber = parseInt(new URLSearchParams(window.location.search).get("t") ?? "");
		if(openedTeamNumber != selectedTeam && !isNaN(openedTeamNumber)) selectTeam(openedTeamNumber);
		(async () => {
			await fetch(`https://www.thebluealliance.com/api/v3/team/frc${openedTeamNumber}`, {
				headers: {
					"X-TBA-Auth-Key": "TBA Auth Key goes here"
				}
			}).then(response => response.json().then(result => setTbaTeamData(result)));
		})();
	}, [selectedTeam]);

	useEffect(() => {
		if(cache.storedData == null) {
			(async () => {
				await fetch("/data")
					.then((response) => {
						response.json().then((result) => {
							const retrievedStats = result.stats.teams as TeamStats[];
							cache.storedData = result as {
								matches: MatchData[],
								teamList: number[],
								stats: {
									teams: TeamStats[],
									matches: any[]
								}
							}
							setTeamStats(retrievedStats);
						});
					});
			})().catch(console.error);
		} else {
			setTeamStats(cache.storedData.stats.teams);
		}
	}, [teamStats]);
	
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
	
	if(teamStats.length == 0) {
		return <div className="h-full flex flex-col justify-center animate-fadeIn">
			<LoadingMessage message="Loading team stats..." />
		</div>
	}

	const TeamNameComponent = () => {
		if(tbaTeamData == null || tbaTeamData["team_number"] != selectedTeam) return <LoadingSpinner />
		return <p className="italic">{tbaTeamData["nickname"]}</p>
	}

	return <div className="animate-fadeIn h-full">
		<div className="flex h-full space-x-4">
			<ItemList
				title="Teams"
				items={
					teamStats.map(stats =>
						<Button
							text={`${stats.teamNumber}`}
							onClick={() => selectTeam(stats.teamNumber)}
							selected={selectedTeam == stats.teamNumber}
						/>)
				}
			/>
			<div className="w-full">
				{
					selectedTeam > 0
					? <div className="flex flex-col items-center h-full">
						<ExternalLink
							linkStyle={styles.teamInfo.numberHeading}
							tooltipStyle="after:content-['View_team_on_The_Blue_Alliance']"
							linkText={`Team ${selectedTeam}`}
							url={`https://www.thebluealliance.com/team/${selectedTeam}`}
						/>
						<div className="h-4">
							<TeamNameComponent />
						</div>
						
						<div className={styles.teamInfo.itemContainer}>

						<div className={styles.teamInfo.categoryContainer}>
							<p className="text-xl">General stats</p>

							<MatchesBar matchDetails={
								statsByTeamNumber(selectedTeam)?.matches.played.map(match => ({
									matchNumber: match.matchNumber,
									winResult: match.winResult
								})) ?? []
							} />

							<div className="mt-4 flex justify-center">
								<Table
									key="general-stats"
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
											})
										]
									]}
								/>
							</div>
						</div>

						<hr className={styles.separator} />

						<div className={styles.teamInfo.categoryContainer}>
							<p className="text-xl">Score stats</p>
							
							<div className={styles.teamInfo.scoreStats.wrapper}>
								<div className={styles.teamInfo.scoreStats.row}>
									<Table firstIsRowLabel
										key="score-stats"
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
						</div>

						<hr className={styles.separator} />

						<div className={styles.teamInfo.categoryContainer}>
							<p className="text-xl">Misc.</p>

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
										key="misc"
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
					</div>
				</div>
				: <p className="text-lg text-center">Select a team</p>
				}
			</div>
		</div>
	</div>
}