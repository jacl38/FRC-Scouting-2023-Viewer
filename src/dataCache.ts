import { AllianceType, MatchData, MatchStats, TeamStats } from "./objectModel"

export const cache: {
	storedData: {
		matches: MatchData[],
		teamList: number[],
		stats: {
			teams: TeamStats[],
			matches: MatchStats[]
		}
	} | null
} = {
	storedData: null
}

export const statsByTeamNumber = (teamNumber: number) => cache.storedData?.stats.teams.find(team => team.teamNumber == teamNumber) ?? null;
export const matchByMatchNumber = (matchNumber: number) => ({
	red: cache.storedData?.matches.find(match => match.alliance == AllianceType.red && match.matchNumber == matchNumber) ?? null,
	blue: cache.storedData?.matches.find(match => match.alliance == AllianceType.blue && match.matchNumber == matchNumber) ?? null
});