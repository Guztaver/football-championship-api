import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'football_championship';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (db) {
        return db;
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();

        db = client.db(MONGODB_DATABASE);
        console.log('✅ Successfully connected to MongoDB');

        // Create indexes for better query performance
        await createIndexes(db);

        return db;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
}

async function createIndexes(database: Db) {
    try {
        // Teams indexes
        await database.collection('teams').createIndex({ name: 1 }, { unique: true });

        // Players indexes
        await database.collection('players').createIndex({ teamId: 1 });
        await database.collection('players').createIndex({ position: 1 });

        // Matches indexes
        await database.collection('matches').createIndex({ date: -1 });
        await database.collection('matches').createIndex({ homeTeamId: 1 });
        await database.collection('matches').createIndex({ awayTeamId: 1 });
        await database.collection('matches').createIndex({ championshipId: 1 });

        // Championships indexes
        await database.collection('championships').createIndex({ year: -1 });
        await database.collection('championships').createIndex({ name: 1, year: 1 }, { unique: true });

        // Stadiums indexes
        await database.collection('stadiums').createIndex({ name: 1 }, { unique: true });

        console.log('📊 Database indexes created successfully');
    } catch (error) {
        console.warn('⚠️  Some indexes may already exist:', error);
    }
}

export async function closeDatabase(): Promise<void> {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('🔌 MongoDB connection closed');
    }
}

export function getDatabase(): Db {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db;
}
