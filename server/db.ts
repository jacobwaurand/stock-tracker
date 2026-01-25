import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const sql = postgres(connectionString, {
  ssl: "require", // This is the magic line for Render
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export default sql;
