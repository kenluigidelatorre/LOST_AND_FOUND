<<<<<<< HEAD
# Database (PostgreSQL)

This folder contains the PostgreSQL schema and seed data for the Lost and Found System.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Creates the `users`, `items`, `claims`, and `notifications` tables, including constraints, foreign keys, and indexes. Safe to run more than once. |
| `seed.sql` | Inserts demonstration user accounts and sample lost-and-found items. |

## Database Relationships

- `users` -> `items`: Each item is linked to its reporter through `reported_by`.
- `users` -> `claims`: Each claim is linked to its claimant through `claimant_id`.
- `items` -> `claims`: Each claim references an item through `item_id`.
- `users` -> `notifications`: Each notification belongs to a user through `user_id`.

## Item Status Flow

`pending` -> `approved` -> `claimed` -> `returned`

Items may also move from `pending` to `rejected`.

## Claim Status Flow

`pending` -> `approved` or `rejected`

The `returned_at` field records when an administrator records an item's return.

## Running the SQL Files

Ensure PostgreSQL is running and the `lost_and_found` database exists.

If the database does not exist yet, create it once from the project root:

```powershell
psql -U postgres -c "CREATE DATABASE lost_and_found;"
```

Run the following commands from the project root:

```powershell
psql -U postgres -d lost_and_found -f database/schema.sql
psql -U postgres -d lost_and_found -f database/seed.sql
```

Run `schema.sql` before `seed.sql` because the demonstration data depends on the tables and relationships created by the schema.

The backend setup script also expects the database files to be named `database/schema.sql` and `database/seed.sql`.

## Demonstration Accounts

- Admin: `admin@school.edu` - password: `Admin123!`
- Student: `juan@school.edu` - password: `Student123!`
- Student: `maria@school.edu` - password: `Student123!`

These accounts and records are for demonstration purposes only. Do not use real student information or production credentials in mock data.
=======
# Database

## Overview
This folder contains database-related files and documentation for the Lost and Found WebApp.

## Purpose
The database stores and manages information about users, lost items, found items, and claim requests to help keep records organized and track item recovery.

## Contents
- Database schema and table definitions
- SQL scripts for creating tables, if applicable
- Database setup instructions
- Sample or seed data for development, if needed

## Notes
- The database technology and schema will be confirmed by the development team.
- Do not commit passwords, connection strings, or other sensitive credentials.
- Store actual database credentials in environment variables and use `.env.example` for placeholders.
- Keep database documentation updated when the schema changes.

**Team:** Atlanteans IT
>>>>>>> origin/main
