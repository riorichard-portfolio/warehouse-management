import { Pool, PoolClient } from 'pg';
import { WritePostgres } from '@/config/env';
import {
    SqlArrayRows,
    SqlDB,
    SqlStatement,
} from './interfaces';

export default class PostgreDatabase implements SqlDB {
    private pool: Pool;

    // Private static variables
    private readonly UNHEALTHY = "UNHEALTHY";
    private readonly HEALTHY = "HEALTHY";
    private readonly minimumConnection: number

    constructor(config: WritePostgres) {
        this.pool = new Pool({
            host: config.POSTGRES_HOST,
            port: config.POSTGRES_PORT,
            database: config.POSTGRES_DB,
            user: config.POSTGRES_USER,
            password: config.POSTGRES_PASSWORD,
            max: config.POSTGRES_MAX_IDLE_CONN,
            min: config.POSTGRES_MIN_IDLE_CONN,
            maxUses: config.POSTGRES_MAX_CONN_USES
        });
        this.minimumConnection = config.POSTGRES_MIN_IDLE_CONN
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.pool.on('error', (err) => {
            console.error('❌ PostgreSQL pool error:', err);
        });
        this.pool.on('connect', () => {
            console.log('✅ New client connected to pool');
        });

        this.pool.on('remove', () => {
            console.log('🔌 Client removed from pool');
        });
    }

    // ✅ CONNECTION WARMING METHOD
    public async warmup(): Promise<void> {
        console.log('🔥 Warming up PostgreSQL connections...');
        const startTime = Date.now();

        const connectPromises = new Array<Promise<PoolClient>>(this.minimumConnection);

        for (let i = 0; i < this.minimumConnection; i++) {
            connectPromises[i] = this.pool.connect()
        }
        let clients = new Array<PoolClient>(this.minimumConnection)
        try {
            clients = await Promise.all(connectPromises);
        } finally {
            for (const client of clients) {
                client.release();
            }
        }

        const duration = Date.now() - startTime;
        console.log(`✅ PostgreSQL warmed up in ${duration}ms`);
    }

    public async healthCheck(): Promise<"HEALTHY" | "UNHEALTHY"> {
        const client = await this.pool.connect();
        try {
            await client.query('SELECT 1');
            return this.HEALTHY;
        } catch {
            return this.UNHEALTHY;
        } finally {
            client.release();
        }
    }

    public prepareSql(sql: string, params: string[] = []): SqlStatement {
        return [sql, params]
    }

    public async command(statement: SqlStatement): Promise<void> {
        const client = await this.pool.connect();
        try {
            const doBlockSql = `
                DO $$
                BEGIN
                    ${statement[0]}
                END;
                $$;
            `;

            await client.query({
                text: doBlockSql,
                values: [...statement[1]]
            });
        } finally {
            client.release();
        }
    }

    public async query(statement: SqlStatement): Promise<SqlArrayRows> {
        const client = await this.pool.connect();
        try {
            const result = await client.query({
                text: statement[0],
                values: [...statement[1]],
                rowMode: 'array'
            });
            return result.rows;
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        try {
            await this.pool.end();
            console.log('✅ PostgreSQL pool closed');
        } catch (error) {
            console.error('❌ Error closing PostgreSQL pool:', error);
            throw error;
        }
    }
}