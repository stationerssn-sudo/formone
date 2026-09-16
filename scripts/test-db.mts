import "dotenv/config";
import { pool } from "../server/db.js";

try {
  const [rows] = await pool.query("SELECT 1 AS ok");
  console.log("LOCAL TEST OK:", JSON.stringify(rows));
  process.exit(0);
} catch (error) {
  console.log(
    "LOCAL TEST FAIL:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}
