import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import type { Player, CreatePlayerDto, UpdatePlayerDto } from '../types/index.js';

const COLLECTION = 'players';

export const PlayerModel = {
    async create(data: CreatePlayerDto): Promise<Player> {
        const db = getDatabase();
        const player: Omit<Player, '_id'> = {
            ...data,
            teamId: new ObjectId(data.teamId),
            birthDate: new Date(data.birthDate),
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection<Player>(COLLECTION).insertOne(player as Player);
        return { ...player, _id: result.insertedId };
    },

    async findAll(page: number = 1, limit: number = 10, teamId?: string, position?: string) {
        const db = getDatabase();
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (teamId) filter.teamId = new ObjectId(teamId);
        if (position) filter.position = position;

        const [players, total] = await Promise.all([
            db.collection<Player>(COLLECTION)
                .find(filter)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection<Player>(COLLECTION).countDocuments(filter),
        ]);

        return {
            players,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: string): Promise<Player | null> {
        const db = getDatabase();
        return await db.collection<Player>(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async findByTeam(teamId: string): Promise<Player[]> {
        const db = getDatabase();
        return await db.collection<Player>(COLLECTION)
            .find({ teamId: new ObjectId(teamId) })
            .sort({ number: 1 })
            .toArray();
    },

    async update(id: string, data: UpdatePlayerDto): Promise<Player | null> {
        const db = getDatabase();
        const updateData: any = {
            ...data,
            updatedAt: new Date(),
        };

        if (data.teamId) {
            updateData.teamId = new ObjectId(data.teamId);
        }

        if (data.birthDate) {
            updateData.birthDate = new Date(data.birthDate);
        }

        const result = await db.collection<Player>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string): Promise<boolean> {
        const db = getDatabase();
        const result = await db.collection<Player>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async updateStats(id: string, stats: { goals?: number; assists?: number; yellowCards?: number; redCards?: number }): Promise<Player | null> {
        const db = getDatabase();
        const result = await db.collection<Player>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $inc: {
                    ...(stats.goals && { goals: stats.goals }),
                    ...(stats.assists && { assists: stats.assists }),
                    ...(stats.yellowCards && { yellowCards: stats.yellowCards }),
                    ...(stats.redCards && { redCards: stats.redCards }),
                },
                $set: { updatedAt: new Date() },
            },
            { returnDocument: 'after' }
        );

        return result || null;
    },
};
