import { ObjectId } from 'mongodb';
import { getDatabase } from '@/config/database';
import type { Match, CreateMatchDto, UpdateMatchDto } from '@/types';

const COLLECTION = 'matches';

export const MatchModel = {
    async create(data: CreateMatchDto): Promise<Match> {
        const db = getDatabase();
        const match: Omit<Match, '_id'> = {
            homeTeamId: new ObjectId(data.homeTeamId),
            awayTeamId: new ObjectId(data.awayTeamId),
            championshipId: new ObjectId(data.championshipId),
            stadiumId: data.stadiumId ? new ObjectId(data.stadiumId) : undefined,
            date: new Date(data.date),
            round: data.round,
            status: 'scheduled',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection<Match>(COLLECTION).insertOne(match as Match);
        return { ...match, _id: result.insertedId };
    },

    async findAll(
        page: number = 1,
        limit: number = 10,
        filters?: { teamId?: string; championshipId?: string; status?: string; dateFrom?: string; dateTo?: string }
    ) {
        const db = getDatabase();
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (filters?.teamId) {
            const teamObjId = new ObjectId(filters.teamId);
            filter.$or = [
                { homeTeamId: teamObjId },
                { awayTeamId: teamObjId },
            ];
        }

        if (filters?.championshipId) {
            filter.championshipId = new ObjectId(filters.championshipId);
        }

        if (filters?.status) {
            filter.status = filters.status;
        }

        if (filters?.dateFrom || filters?.dateTo) {
            filter.date = {};
            if (filters.dateFrom) filter.date.$gte = new Date(filters.dateFrom);
            if (filters.dateTo) filter.date.$lte = new Date(filters.dateTo);
        }

        const [matches, total] = await Promise.all([
            db.collection<Match>(COLLECTION)
                .find(filter)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection<Match>(COLLECTION).countDocuments(filter),
        ]);

        return {
            matches,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: string): Promise<Match | null> {
        const db = getDatabase();
        return await db.collection<Match>(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async findByIdWithTeams(id: string) {
        const db = getDatabase();
        const match = await db.collection<Match>(COLLECTION).findOne({ _id: new ObjectId(id) });

        if (!match) return null;

        const [homeTeam, awayTeam] = await Promise.all([
            db.collection('teams').findOne({ _id: match.homeTeamId }),
            db.collection('teams').findOne({ _id: match.awayTeamId }),
        ]);

        return { ...match, homeTeam, awayTeam };
    },

    async update(id: string, data: UpdateMatchDto): Promise<Match | null> {
        const db = getDatabase();
        const updateData: any = {
            ...data,
            updatedAt: new Date(),
        };

        if (data.homeTeamId) updateData.homeTeamId = new ObjectId(data.homeTeamId);
        if (data.awayTeamId) updateData.awayTeamId = new ObjectId(data.awayTeamId);
        if (data.championshipId) updateData.championshipId = new ObjectId(data.championshipId);
        if (data.stadiumId) updateData.stadiumId = new ObjectId(data.stadiumId);
        if (data.date) updateData.date = new Date(data.date);

        const result = await db.collection<Match>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string): Promise<boolean> {
        const db = getDatabase();
        const result = await db.collection<Match>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async updateScore(id: string, homeScore: number, awayScore: number): Promise<Match | null> {
        const db = getDatabase();
        const result = await db.collection<Match>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    homeScore,
                    awayScore,
                    status: 'finished',
                    updatedAt: new Date(),
                },
            },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async findByChampionship(championshipId: string): Promise<Match[]> {
        const db = getDatabase();
        return await db.collection<Match>(COLLECTION)
            .find({ championshipId: new ObjectId(championshipId) })
            .sort({ date: 1, round: 1 })
            .toArray();
    },
};
