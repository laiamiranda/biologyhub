import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      if (!line || line.trim().startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1);
        if (key) process.env[key] = val;
      }
    });
  } catch {}
}
loadEnv();

const dbPool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'biologyhub',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

async function ensureSchema() {
  const conn = await dbPool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(32),
        order_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        id CHAR(36) PRIMARY KEY,
        category_id CHAR(36),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        track_number INT NOT NULL UNIQUE,
        difficulty_level ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
        estimated_hours INT DEFAULT 2,
        order_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tracks_category (category_id),
        CONSTRAINT fk_tracks_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } finally {
    conn.release();
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/categories', async (_req, res) => {
  const [rows] = await dbPool.query('SELECT * FROM categories ORDER BY order_index');
  res.json(rows);
});

app.get('/api/tracks', async (req, res) => {
  const { category_id, difficulty } = req.query as { category_id?: string; difficulty?: string };
  let sql = 'SELECT * FROM tracks';
  const params: any[] = [];
  const where: string[] = [];
  if (category_id) {
    where.push('category_id = ?');
    params.push(category_id);
  }
  if (difficulty) {
    where.push('difficulty_level = ?');
    params.push(difficulty);
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY track_number';
  const [rows] = await dbPool.query(sql, params);
  res.json(rows);
});

ensureSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
