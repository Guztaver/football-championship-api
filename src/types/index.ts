import { ObjectId } from 'mongodb';

// ========== Team Types ==========
export interface Team {
    _id?: ObjectId;
    name: string;
    logo?: string;
    founded: number;
    stadiumId?: ObjectId;
    city: string;
    country: string;
    coach?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTeamDto {
    name: string;
    logo?: string;
    founded: number;
    stadiumId?: string;
    city: string;
    country: string;
    coach?: string;
}

export interface UpdateTeamDto {
    name?: string;
    logo?: string;
    founded?: number;
    stadiumId?: string;
    city?: string;
    country?: string;
    coach?: string;
}

// ========== Player Types ==========
export interface Player {
    _id?: ObjectId;
    name: string;
    teamId: ObjectId;
    position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    number: number;
    birthDate: Date;
    nationality: string;
    height?: number; // in cm
    weight?: number; // in kg
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePlayerDto {
    name: string;
    teamId: string;
    position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    number: number;
    birthDate: string;
    nationality: string;
    height?: number;
    weight?: number;
}

export interface UpdatePlayerDto {
    name?: string;
    teamId?: string;
    position?: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    number?: number;
    birthDate?: string;
    nationality?: string;
    height?: number;
    weight?: number;
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
}

// ========== Match Types ==========
export interface Match {
    _id?: ObjectId;
    homeTeamId: ObjectId;
    awayTeamId: ObjectId;
    championshipId: ObjectId;
    stadiumId?: ObjectId;
    date: Date;
    homeScore?: number;
    awayScore?: number;
    status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
    round?: number;
    attendance?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    championshipId: string;
    stadiumId?: string;
    date: string;
    round?: number;
}

export interface UpdateMatchDto {
    homeTeamId?: string;
    awayTeamId?: string;
    championshipId?: string;
    stadiumId?: string;
    date?: string;
    homeScore?: number;
    awayScore?: number;
    status?: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
    round?: number;
    attendance?: number;
}

// ========== Championship Types ==========
export interface ChampionshipStanding {
    teamId: ObjectId;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

export interface Championship {
    _id?: ObjectId;
    name: string;
    year: number;
    startDate: Date;
    endDate?: Date;
    teams: ObjectId[];
    standings?: ChampionshipStanding[];
    status: 'upcoming' | 'ongoing' | 'finished';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateChampionshipDto {
    name: string;
    year: number;
    startDate: string;
    endDate?: string;
    teams: string[];
}

export interface UpdateChampionshipDto {
    name?: string;
    year?: number;
    startDate?: string;
    endDate?: string;
    teams?: string[];
    status?: 'upcoming' | 'ongoing' | 'finished';
}

// ========== Stadium Types ==========
export interface Stadium {
    _id?: ObjectId;
    name: string;
    capacity: number;
    city: string;
    country: string;
    address?: string;
    inaugurated?: number;
    surface?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateStadiumDto {
    name: string;
    capacity: number;
    city: string;
    country: string;
    address?: string;
    inaugurated?: number;
    surface?: string;
}

export interface UpdateStadiumDto {
    name?: string;
    capacity?: number;
    city?: string;
    country?: string;
    address?: string;
    inaugurated?: number;
    surface?: string;
}

// ========== Common Types ==========
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
