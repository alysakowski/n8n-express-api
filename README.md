# Fake Express API

Express API with TypeScript that returns mocked data from JSON.

## Setup

```bash
npm install
```

### Database Setup

This project uses Drizzle ORM with PostgreSQL. To set up the database:

1. **Install PostgreSQL** (if not already installed)

2. **Create a database**:
   ```bash
   createdb n8n_express_api
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://localhost:5432/n8n_express_api
   DATABASE_URL=http://localhost:3000/
   ```

4. **Generate and run migrations**:
   ```bash
   npm run db:generate  # Generate migration files
   npm run db:push      # Push schema to database (or use db:migrate for production)
   ```

5. **Optional: Open Drizzle Studio** (database GUI):
   ```bash
   npm run db:studio
   ```

### Database Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run migrations (production)
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:studio` - Open Drizzle Studio for database management

## Development (with hot reload)

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

- `GET /api/farmer-inputs` - Returns all farmer input data
- `GET /api/farmer-inputs/:fieldId` - Returns a single farmer input field by fieldId (e.g., `/api/farmer-inputs/F001`)
- `GET /api/remote-sensing` - Returns all remote sensing data
- `GET /api/remote-sensing/:fieldId` - Returns a single remote sensing field by fieldId (e.g., `/api/remote-sensing/F001`)

## Making it publicly available for n8n

To expose your local server publicly, you can use:

1. **ngrok** (recommended):
   ```bash
   npx ngrok http 3000
   ```

2. **localtunnel**:
   ```bash
   npx localtunnel --port 3000
   ```

3. **cloudflared**:
   ```bash
   npx cloudflared tunnel --url http://localhost:3000
   ```

Use the provided public URL in your n8n workflow.

## Build for production

```bash
npm run build
npm start
```

