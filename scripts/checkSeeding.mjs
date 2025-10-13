import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local manually so we don't depend on shell env
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
} catch (e) {
  // ignore if missing; script will error with clear message below
}

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = process.env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Missing env: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function count(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) {
    return { table, error: error.message };
  }
  return { table, count };
}

(async () => {
  const tables = ['categories', 'tracks', 'lessons', 'quiz_questions'];
  const results = await Promise.all(tables.map(count));
  for (const r of results) {
    if (r.error) {
      console.error(`${r.table}: ERROR - ${r.error}`);
    } else {
      console.log(`${r.table}: ${r.count}`);
    }
  }
})();
