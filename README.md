# PalletePlate

A Filipino food and nutrition project built with Next.js, TypeScript, Tailwind and MySQL. The new product focuses on food preferences, meal logs, and variety across fruit and vegetable colour groups.

## Current state

The first backend slice adds numbered MySQL migrations, a server-only connection pool, session-based access helpers, and database integration tests. The header, page title, home heading and package name use PalletePlate.

The existing recipe browser, map and login still use the previous Supabase implementation. They have not been connected to MySQL. Do not treat the existing login or map writes as the new production authentication/authorization system. Supabase credentials in an existing `.env.local` may be retained temporarily to run those legacy pages; they are not used by MySQL.

Next: server authentication with email verification and secure cookies, followed by the food browser, meal logging, daily rainbow view, suggestions, community and administration. Friends and shares are stretch goals. Restaurants are outside the new MVP.

## Local setup

Use Node.js 22.18+ (or a newer supported LTS release) and MySQL 8.4+. MariaDB is not a tested substitute.

```bash
npm ci
```

Copy `.env.example` to `.env.local` and replace the MySQL placeholders. Create an empty `palleteplate` database with `utf8mb4` and `utf8mb4_0900_ai_ci` collation. Use a separate migration account with schema privileges to run:

```bash
npm run db:migrate
```

The runner does not create a database. It tracks checksums, prevents concurrent migration runs and stops on incomplete migrations. Migration files are forward-only; see `docs/schema-decisions.md` for recovery constraints.

Before starting the app, use a runtime MySQL account limited to SELECT, INSERT, UPDATE and DELETE on the application database. Do not give it global privileges or schema/user management rights. Never prefix MySQL secrets with `NEXT_PUBLIC_`. Set `MYSQL_TLS=true` for production; the connection verifies the server certificate. `MYSQL_TLS=false` is for a local development server without TLS.

```bash
npm run dev
```

Open http://localhost:3000. Running migrations alone does not migrate the existing pages or create a working MySQL login. No live data has been copied from Supabase.

## Verification

```bash
npm test
npm run lint
npm run build
```

`npm test` checks colour counting and connection configuration. Integration tests exercise real MySQL queries, not a mock policy evaluator:

1. Create a separate, empty database named `palleteplate_test_<suffix>`.
2. Set `MYSQL_TEST_DATABASE` to that name and configure `MYSQL_*` for an account with schema permissions on that test database. Shell environment variables override `.env.local`.
3. Run `npm run test:db`.

Tests apply all migrations twice, then check own-entry access, invalid/expired/unverified/disabled sessions, approved-public post visibility, moderator-only writes, transaction rollback and private recipe access. They refuse a populated database and retain their fixtures for inspection. Use a fresh empty test database for each run.

## Structure

- `database/migrations/`: ordered MySQL schema changes
- `scripts/migrate.mjs`: migration runner
- `lib/db.ts`, `lib/data-access.ts`: server-only connection and cookie-based data access
- `lib/access.mjs`: parameterized access queries exercised by integration tests
- `lib/rainbow.ts`: distinct fruit/vegetable colour counting
- `docs/schema-decisions.md`: ERD corrections, MySQL authorization and scope decisions
- `tests/`: unit and MySQL integration tests
- `app/`, `components/`: existing pages and interface components
- `utils/supabase/`: legacy clients pending replacement

## Food data and limitations

No food seed data is included yet. Food ingestion must verify source reuse terms, preserve citations and licences, and leave unavailable nutrition values NULL. Nutrition columns represent values per 100 g edible portion. No values will be fabricated. The repeatable cleaning/seed script belongs to the food-browser slice.

Four distinct fruit/vegetable colours satisfy the product's rainbow-day rule. Grains do not count toward that rule. This is a product variety indicator, not a clinical nutrition assessment. Colour mapping, source review, daily timezone queries and liked-food suggestions are still pending.

Server authentication, CSRF protection, rate limits, CSP, private image uploads, admin handlers and full page integration remain to be implemented. MySQL has no Postgres-style RLS; future reads and writes must use scoped server authorization and accompanying tests. The requested `/security-review` command is unavailable in this environment; a code review and real database boundary tests were performed for this slice.

The dependency security update removes the reported high and critical findings. Moderate findings remain in the ESLint dependency chain. The existing map uses OpenStreetMap and Nominatim.
