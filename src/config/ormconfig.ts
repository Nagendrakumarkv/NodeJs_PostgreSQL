import { DataSource } from "typeorm";
import "dotenv/config";

//For local DB conection
// const dataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: process.env.DB_PASSWORD || "your_password", // Fallback for testing
//   database: process.env.DATABASE_URL,
//   entities: ["src/entities/*.ts"],
//   migrations: ["src/migrations/*.ts"],
//   synchronize: false, // Set to false to use migrations
//   logging: true,
// });

const isProduction = process.env.NODE_ENV === "production";

//connect to deployed postgree DB
const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Render provides this
  ssl: { rejectUnauthorized: false },
  entities: [isProduction ? "dist/entities/*.js" : "src/entities/*.ts"],
  migrations: [isProduction ? "dist/migrations/*.js" : "src/migrations/*.ts"],
  synchronize: false, // Set to false to use migrations
  logging: true,
});

export default dataSource;
