import { ObjectId } from 'mongodb';
import { getDatabase } from '@/config/database';
import type { Championship, CreateChampionshipDto, UpdateChampionshipDto, ChampionshipStanding } from '@/types';
import { MatchModel } from './match.model';

const COLLECTION = 'championships';

export const ChampionshipModel = {
    async create(data: CreateChampionshipDto): Promise<Championship> {
        const db = getDatabase();
        const championship: Omit<Championship, '_id'> = {
            name: data.name,
            year: data.year,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            teams: data.teams.map(id => new ObjectId(id)),
            standings: [],
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Initialize standings for all teams
        championship.standings = data.teams.map(teamId => ({
            teamId: new ObjectId(teamId),
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
        }));

        const result = await db.collection<Championship>(COLLECTION).insertOne(championship as Championship);
        return { ...championship, _id: result.insertedId };
    },

    async findAll(page: number = 1, limit: number = 10, year?: number) {
        const db = getDatabase();
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (year) filter.year = year;

        const [championships, total] = await Promise.all([
            db.collection<Championship>(COLLECTION)
                .find(filter)
                .sort({ year: -1, startDate: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection<Championship>(COLLECTION).countDocuments(filter),
        ]);

        return {
            championships,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: string): Promise<Championship | null> {
        const db = getDatabase();
        return await db.collection<Championship>(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async update(id: string, data: UpdateChampionshipDto): Promise<Championship | null> {
        const db = getDatabase();
        const updateData: any = {
            ...data,
            updatedAt: new Date(),
        };

        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        if (data.teams) updateData.teams = data.teams.map(id => new ObjectId(id));

        const result = await db.collection<Championship>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string): Promise<boolean> {
        const db = getDatabase();
        const result = await db.collection<Championship>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async calculateStandings(championshipId: string): Promise<ChampionshipStanding[]> {
        const db = getDatabase();
        const championship = await this.findById(championshipId);

        if (!championship) {
            throw new Error('Championship not found');
        }

        // Get all finished matches for this championship
        const matches = await MatchModel.findByChampionship(championshipId);
        const finishedMatches = matches.filter(m => m.status === 'finished' && m.homeScore !== undefined && m.awayScore !== undefined);

        // Initialize standings
        const standings: Map<string, ChampionshipStanding> = new Map();
        championship.teams.forEach(teamId => {
            standings.set(teamId.toString(), {
                teamId,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
            });
        });

        // Calculate standings from matches
        finishedMatches.forEach(match => {
            const homeTeamId = match.homeTeamId.toString();
            const awayTeamId = match.awayTeamId.toString();
            const homeStanding = standings.get(homeTeamId);
            const awayStanding = standings.get(awayTeamId);

            if (!homeStanding || !awayStanding) return;

            const homeScore = match.homeScore!;
            const awayScore = match.awayScore!;

            // Update played
            homeStanding.played++;
            awayStanding.played++;

            // Update goals
            homeStanding.goalsFor += homeScore;
            homeStanding.goalsAgainst += awayScore;
            awayStanding.goalsFor += awayScore;
            awayStanding.goalsAgainst += homeScore;

            // Update results
            if (homeScore > awayScore) {
                homeStanding.won++;
                homeStanding.points += 3;
                awayStanding.lost++;
            } else if (awayScore > homeScore) {
                awayStanding.won++;
                awayStanding.points += 3;
                homeStanding.lost++;
            } else {
                homeStanding.drawn++;
                awayStanding.drawn++;
                homeStanding.points += 1;
                awayStanding.points += 1;
            }

            // Update goal difference
            homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
            awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;
        });

        // Convert to array and sort
        const standingsArray = Array.from(standings.values()).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });

        // Update championship with new standings
        await db.collection<Championship>(COLLECTION).updateOne(
            { _id: new ObjectId(championshipId) },
            { $set: { standings: standingsArray, updatedAt: new Date() } }
        );

        return standingsArray;
    },

    async getStandings(championshipId: string) {
        const championship = await this.findById(championshipId);
        if (!championship) return null;

        // Recalculate standings to ensure they're up to date
        const standings = await this.calculateStandings(championshipId);

        // Get team details
        const db = getDatabase();
        const standingsWithTeams = await Promise.all(
            standings.map(async (standing) => {
                const team = await db.collection('teams').findOne({ _id: standing.teamId });
                return { ...standing, team };
            })
        );

        return standingsWithTeams;
    },
};
