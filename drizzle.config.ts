import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/n8n_express_api";
const urlWithSSL = databaseUrl.includes("render.com") && !databaseUrl.includes("sslmode")
	? `${databaseUrl}?sslmode=require`
	: databaseUrl;

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: urlWithSSL,
	},
});

