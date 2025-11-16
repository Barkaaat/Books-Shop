import pkg from "pg";
const { Client } = pkg;

const adminClient = new Client({
  connectionString: "postgres://postgres:1234@localhost:5433/postgres",
});

const dbName = "books_shop";

export const ensureDatabaseExists = async () => {
  try {
    await adminClient.connect();

    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`⚠️ Database "${dbName}" not found. Creating...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error("❌ Error checking/creating database:", err);
  } finally {
    await adminClient.end();
  }
};
