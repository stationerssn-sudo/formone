import 'dotenv/config'
import mysql from 'mysql2/promise'

const c = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
})
const [tables] = await c.query('SHOW TABLES')
const tableNames = (tables as Array<Record<string, string>>).map((t) => Object.values(t)[0])
for (const table of tableNames) {
  const [cols] = await c.query(`SHOW COLUMNS FROM \`${table}\``)
  console.log(`\n=== ${table} ===`)
  console.log((cols as Array<{ Field: string; Type: string; Null: string; Key: string }>).map((x) => `${x.Field} ${x.Type} ${x.Null === 'NO' ? 'NOT NULL' : ''} ${x.Key}`).join('\n'))
}
await c.end()
