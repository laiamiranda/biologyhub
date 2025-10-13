import { createPool } from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { categoriesData, tracksData } from '../src/lib/seedData';

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

// First connect without database to create it
const adminPool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  connectionLimit: 1,
  charset: 'utf8mb4',
});

const dbPool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'biologyhub',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  connectionLimit: 5,
  charset: 'utf8mb4',
  multipleStatements: true,
});

function uuidv4() {
  return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (Number(c) ^ (crypto.randomBytes(1)[0] & (15 >> (Number(c) / 4)))).toString(16)
  );
}

async function ensureSchema() {
  // First create database using admin connection
  const adminConn = await adminPool.getConnection();
  try {
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE || 'biologyhub'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  } finally {
    adminConn.release();
  }

  // Now use the database connection
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

async function main() {
  await ensureSchema();
  const conn = await dbPool.getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM categories LIMIT 1');
    if ((existing as any[]).length > 0) {
      console.log('Already seeded.');
      return;
    }

    // Insert categories
    const catIdMap: string[] = [];
    for (const cat of categoriesData) {
      const id = uuidv4();
      await conn.query(
        'INSERT INTO categories (id, name, description, icon, order_index) VALUES (?, ?, ?, ?, ?)',
        [id, cat.name, cat.description, cat.icon, cat.order_index]
      );
      catIdMap.push(id);
    }
    console.log(`Inserted ${catIdMap.length} categories`);

    // Insert tracks
    let trackCount = 0;
    for (const t of tracksData) {
      const id = uuidv4();
      const categoryId = catIdMap[t.category_idx];
      await conn.query(
        'INSERT INTO tracks (id, category_id, title, description, track_number, difficulty_level, estimated_hours, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          categoryId,
          t.title,
          t.description,
          t.track_number,
          t.difficulty_level,
          t.estimated_hours,
          t.track_number,
        ]
      );
      trackCount++;
    }
    console.log(`Inserted ${trackCount} tracks`);
  } finally {
    conn.release();
  }
}

main().then(() => {
  console.log('MySQL seed complete.');
  process.exit(0);
}).catch((e) => {
  console.error('MySQL seed failed:', e);
  process.exit(1);
});
