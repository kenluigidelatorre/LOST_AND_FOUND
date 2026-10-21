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