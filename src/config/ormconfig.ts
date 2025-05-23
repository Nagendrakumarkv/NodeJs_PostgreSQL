import { DataSource } from "typeorm";
import "dotenv/config";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASSWORD || "your_password", // Fallback for testing
  database: process.env.DATABASE_URL,
  //ssl: { rejectUnauthorized: false },
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, // Set to false to use migrations
  logging: true,
});

export default dataSource;
