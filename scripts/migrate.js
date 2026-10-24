// Migration runner tối giản — đây là thứ Prisma/TypeORM migrate làm "phía sau hậu trường":
// 1. Giữ bảng schema_migrations ghi lại file nào đã chạy
// 2. Chạy lần lượt các file migrations/*.sql CHƯA chạy, theo thứ tự tên file
// 3. Mỗi file chạy trong 1 transaction: lỗi giữa chừng → rollback, DB không bị dở dang
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

  const applied = new Set((await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name));
  const dir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip   ${file}`);
      continue;
    }
    console.log(`apply  ${file}`);
    await client.query('BEGIN');
    try {
      await client.query(fs.readFileSync(path.join(dir, file), 'utf8'));
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }

  await client.end();
  console.log('migrations up to date');
}

main().catch((err) => {
  console.error('migration failed:', err.message);
  process.exit(1);
});
