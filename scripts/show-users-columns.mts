import "dotenv/config";
import mysql from "mysql2/promise";

const c = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});
const [cols] = await c.query("SHOW COLUMNS FROM users");
console.log(
  (cols as Array<{ Field: string; Type: string }>)
    .map((x) => `${x.Field} ${x.Type}`)
    .join("\n"),
);
await c.end();
