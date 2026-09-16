import 'dotenv/config'
import mysql from 'mysql2/promise'

const isAiven = !!process.env.DB_HOST?.includes('aivencloud.com')

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Aiven (na hosting nyingine za managed MySQL) zinahitaji SSL
  ...(isAiven ? { ssl: { rejectUnauthorized: false }, connectTimeout: 15000 } : {}),
})
