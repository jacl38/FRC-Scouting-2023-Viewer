import { useEffect, useState } from "react";
import { MatchData, TeamStats } from "../objectModel";
import { cache } from "../dataCache";
import { ItemList } from "../components/ItemList";
import { Button } from "../components/Button";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";

export const Compare = () => {
	const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
	const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

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

	const selectTeam = (teamNumber: number) => {
		const currentSelectedTeams = selectedTeams;
		currentSelectedTeams.push(teamNumber);
		setSelectedTeams([...new Set(currentSelectedTeams)]);
	}

	const deselectTeam = (teamNumber: number) => {
		const currentSelectedTeams = selectedTeams.filter(t => t != teamNumber);
		setSelectedTeams([...new Set(currentSelectedTeams)]);
	}

	const toggleTeam = (teamNumber: number) => {
		if(isTeamSelected(teamNumber)) deselectTeam(teamNumber);
		else selectTeam(teamNumber);
	}

	const isTeamSelected = (teamNumber: number) => selectedTeams.includes(teamNumber);

	const formatPercent = (value: number) => value.toLocaleString(undefined, { style: "percent", maximumFractionDigits: 2 });
	const formatShort = (value: number) => value.toLocaleString(undefined, { maximumSignificantDigits: 2 });

	return <div className="animate-fadeIn h-full">
		<div className="flex h-full space-x-4">
			<ItemList
					title="Teams"
					items={
						teamStats.map(stats =>
							<Button
								text={`${stats.teamNumber}`}
								onClick={() => { toggleTeam(stats.teamNumber) }}
								selected={isTeamSelected(stats.teamNumber)}
							/>)
					}
			/>
			<div className="w-full h-full">
				{
					selectedTeams.length <= 1
					? <p className="text-lg text-center">Select at least two teams for comparison</p>
					: <div className="w-full h-full flex flex-col items-center space-y-4 animate-fadeIn">
						<p className="text-lg text-center">Comparing {selectedTeams.length} teams.</p>
						<Table firstIsRowLabel sortable
							key="compare"
							headings={[
								"Win %",
								"Mobility %",
								"Auto Charge %",
								"End Charge %",
								"Top Total",
								"Top Mean",
								"Top Links",
								"Mid Total",
								"Mid Mean",
								"Mid Links",
								"Low Total",
								"Low Mean",
								"Low Links",
							]}
							rows={
								teamStats.filter(team => selectedTeams.includes(team.teamNumber)).map(team => {
									return [
										
										<Link
											to={`/team-viewer/?t=${team.teamNumber}`}
											className="underline"
										>
											<p className="hover:-translate-y-0.5 hover:scale-105 transition-all">{team.teamNumber}</p>
										</Link>,

										formatPercent(team.matches.winPercent),
										formatPercent(team.auto.mobilityPercent),
										formatPercent(team.auto.chargePercent),
										formatPercent(team.end.chargePercent),

										team.teleop.scoreGrid.top.rawTotal,
										formatShort(team.teleop.scoreGrid.top.mean),
										formatShort(team.teleop.scoreGrid.top.rawLinkTotal),

										team.teleop.scoreGrid.mid.rawTotal,
										formatShort(team.teleop.scoreGrid.mid.mean),
										formatShort(team.teleop.scoreGrid.mid.rawLinkTotal),
										
										team.teleop.scoreGrid.low.rawTotal,
										formatShort(team.teleop.scoreGrid.low.mean),
										formatShort(team.teleop.scoreGrid.low.rawLinkTotal)
									]
								})
							}
						/>
					</div>
				}
			</div>
		</div>
	</div>
}