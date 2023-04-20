// General reusable object models
export enum AllianceType { none = "none", blue = "blue", red = "red" }
export enum WinResult { defeat = "defeat", tie = "tie", victory = "victory" }

// Game-specific object models (2023)
export enum ChargeType { none = "none", docked = "docked", charged = "charged" }
export enum ItemType { none = "none", cube = "cube", cone = "cone" }
export type RowType = "top" | "mid" | "low";

export type rowStats = {
	linkTotals: number[],
	rawLinkTotal: number,
	meanLinks: number,
	heatMap: { top: number[], mid: number[], low: number[] },
	totals: number[],
	itemTotals: {
		top: { cubes: number, cones: number },
		mid: { cubes: number, cones: number },
		low: { cubes: number, cones: number },
	},
	rawTotal: number,
	mean: number,
	median: number,
	variance: number,
	stdev: number
}

export type AllianceStats = {
	matchNumber: number,
	alliance: AllianceType,
	coop: boolean,
	winResult: WinResult,
	teams: number[],
	scoresPerTeam: number[],
	pointsPerTeam: number[],
	linksPerTeam: number[],
	activation: boolean,
	sustainability: boolean,
	rankingPoints: number
}

export type MatchStats = {
	matchNumber: number,
	coop: boolean,
	blue: AllianceStats,
	red: AllianceStats
}

export type TeamStats = {
	teamNumber: number,
	notes: string[],
	emojis: string[],

	matches: {
		played: { matchNumber: number, alliance: AllianceType, winResult: WinResult }[],
		numberPlayed: number,
		won: number,
		lost: number,
		tie: number,
		winPercent: number
	},

	auto: {
		mobility: number,
		mobilityPercent: number,
		docked: number,
		charged: number,
		chargePercent: number
	},

	teleop: {
		scoreGrid: {
			top: rowStats,
			mid: rowStats,
			low: rowStats
		}
	},

	end: {
		docked: number,
		charged: number,
		chargePercent: number
	}
}

export type Score = {
	teamID: 0 | 1 | 2 | 3,
	auto: boolean,
	item: ItemType
}

export type TeamData = {
	id: 0 | 1 | 2 | 3,
	teamNumber: number,
	autoMobility: boolean,
	autoCharge: ChargeType,
	endCharge: ChargeType,
	notes: string
}

export type MatchData = {
	matchNumber: number,
	timestamp: Date,
	alliance: AllianceType,
	winResult: WinResult,
	team1Data: TeamData,
	team2Data: TeamData,
	team3Data: TeamData,
	scoreGrid: {
		top: Score[],
		mid: Score[],
		low: Score[]
	}
}