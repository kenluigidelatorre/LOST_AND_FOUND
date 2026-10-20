
# Lost and Found System — Backend

## Overview

The backend of the Lost and Found System handles API requests, validates submitted data, communicates with the PostgreSQL database, and provides data to the frontend.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- dotenv
- CORS

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Install the following before running the backend:

- Node.js and npm
- PostgreSQL
- Git
- Visual Studio Code (recommended)

## Installation

Open a terminal inside the `backend` folder and run:

```bash
npm install
```

## Environment Configuration

Create a `.env` file inside the `backend` folder.

Add the following configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lost_and_found_db
DB_USER=postgres
DB_PASSWORD=your_local_password
```

Replace `your_local_password` with your local PostgreSQL password.

**Security:** Never commit the `.env` file or share database passwords through GitHub.

## Database Setup

1. Start PostgreSQL.
2. Create a database named `lost_and_found_db`.
3. Run the SQL commands in `database/schema.sql` against that database.
4. Make sure the required tables have been created.
5. Verify that the database settings in `.env` match your local PostgreSQL configuration.

The `database/schema.sql` file is located in the project's root-level `database` folder, not inside `backend`.

## Running the Backend

Start the development server:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend and database connectivity |
| GET | `/api/items` | Retrieve all item reports |
| POST | `/api/items` | Create an item report |

### Example: Create an Item Report

**Endpoint:** `POST /api/items`

**Request body:**

```json
{
  "item_name": "Black Wallet",
  "description": "A black wallet with an ID inside",
  "location": "School Library",
  "type": "LOST"
}
```

The `type` field must be `LOST` or `FOUND`.

## Testing

You can test the API using Postman.

1. Start the backend server.
2. Send a `GET` request to `http://localhost:5000/api/health`.
3. Send a `GET` request to `http://localhost:5000/api/items`.
4. Send a `POST` request to `http://localhost:5000/api/items` with the example JSON body.
5. Send another `GET` request to verify that the new record was saved.

## Development Notes

- The frontend communicates with the backend through HTTP API requests.
- The backend is responsible for validating requests and accessing PostgreSQL.
- Each developer should configure their own local `.env` file.
- Keep the API endpoint paths and request field names consistent across the frontend and backend.
- Update this README whenever the API endpoints, configuration, or setup process changes.

## Project Status

Initial backend setup and item-report endpoints are under development.
