import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import type { Team, CreateTeamDto, UpdateTeamDto } from '../types/index.js';

const COLLECTION = 'teams';

export const TeamModel = {
    async create(data: CreateTeamDto): Promise<Team> {
        const db = getDatabase();
        const team: Omit<Team, '_id'> = {
            ...data,
            stadiumId: data.stadiumId ? new ObjectId(data.stadiumId) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection<Team>(COLLECTION).insertOne(team as Team);
        return { ...team, _id: result.insertedId };
    },

    async findAll(page: number = 1, limit: number = 10) {
        const db = getDatabase();
        const skip = (page - 1) * limit;

        const [teams, total] = await Promise.all([
            db.collection<Team>(COLLECTION)
                .find()
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection<Team>(COLLECTION).countDocuments(),
        ]);

        return {
            teams,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: string): Promise<Team | null> {
        const db = getDatabase();
        return await db.collection<Team>(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async findByName(name: string): Promise<Team | null> {
        const db = getDatabase();
        return await db.collection<Team>(COLLECTION).findOne({ name });
    },

    async update(id: string, data: UpdateTeamDto): Promise<Team | null> {
        const db = getDatabase();
        const updateData: any = {
            ...data,
            updatedAt: new Date(),
        };

        if (data.stadiumId) {
            updateData.stadiumId = new ObjectId(data.stadiumId);
        }

        const result = await db.collection<Team>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string): Promise<boolean> {
        const db = getDatabase();
        const result = await db.collection<Team>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async getWithPlayers(id: string) {
        const db = getDatabase();
        const team = await db.collection<Team>(COLLECTION).findOne({ _id: new ObjectId(id) });

        if (!team) return null;

        const players = await db.collection('players')
            .find({ teamId: new ObjectId(id) })
            .toArray();

        return { ...team, players };
    },
};
