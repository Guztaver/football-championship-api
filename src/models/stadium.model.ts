import { ObjectId } from 'mongodb';
import { getDatabase } from '@/config/database';
import type { Stadium, CreateStadiumDto, UpdateStadiumDto } from '@/types';

const COLLECTION = 'stadiums';

export const StadiumModel = {
    async create(data: CreateStadiumDto): Promise<Stadium> {
        const db = getDatabase();
        const stadium: Omit<Stadium, '_id'> = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection<Stadium>(COLLECTION).insertOne(stadium as Stadium);
        return { ...stadium, _id: result.insertedId };
    },

    async findAll(page: number = 1, limit: number = 10) {
        const db = getDatabase();
        const skip = (page - 1) * limit;

        const [stadiums, total] = await Promise.all([
            db.collection<Stadium>(COLLECTION)
                .find()
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection<Stadium>(COLLECTION).countDocuments(),
        ]);

        return {
            stadiums,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: string): Promise<Stadium | null> {
        const db = getDatabase();
        return await db.collection<Stadium>(COLLECTION).findOne({ _id: new ObjectId(id) });
    },

    async findByName(name: string): Promise<Stadium | null> {
        const db = getDatabase();
        return await db.collection<Stadium>(COLLECTION).findOne({ name });
    },

    async update(id: string, data: UpdateStadiumDto): Promise<Stadium | null> {
        const db = getDatabase();
        const updateData = {
            ...data,
            updatedAt: new Date(),
        };

        const result = await db.collection<Stadium>(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result || null;
    },

    async delete(id: string): Promise<boolean> {
        const db = getDatabase();
        const result = await db.collection<Stadium>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },
};
