import pg from 'pg';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

const { Pool } = pg;

const connection = new Pool ({
    connectionString: process.env.DATABASE_URL,
});

export { connection };

