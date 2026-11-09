# Schema decisions

PalletePlate uses MySQL 8.4 or newer. This replaces the Supabase/Postgres stack in the project brief, following the explicit decision to retain MySQL.

## ERD changes

- `USER` becomes `accounts` and `profiles`. Accounts hold private authentication fields; profiles hold the name, region, optional gender and optional contact number. Profile reads in this slice are owner-only, including contact details.
- Supabase Auth cannot own credentials for an independent MySQL login. The planned server authentication layer stores password hashes in `accounts`, never plaintext or reversible passwords. Login, password hashing and verification email delivery are the next slice and are not implemented here.
- `DEVELOPER` becomes `user_roles`, with admin and moderator assignments managed outside public registration. An absent role means an ordinary user. No public role-changing endpoint exists.
- Sessions and email-verification tokens are separate, expiring records containing SHA-256 token hashes. Session reads require an active account and verified email. Tokens must be random 32-byte values; the next auth slice will issue and rotate them in HttpOnly cookies with Secure in production and SameSite=Lax. No tokens may be accepted from URL parameters.
- Food likes/dislikes move from `FOOD` to `user_food_preferences`, unique per user and food. No row means no preference.
- Favourite recipes become `user_favorite_recipes`. Ingredients become `recipe_ingredients`, with a quantity and a food reference. Ordered instructions become `recipe_steps`.
- Ingredient colours are derived by joining foods; no independently editable recipe colour array exists.
- Entries link to foods through `entry_foods` and recipes through `entry_recipes`. Each link is unique. An entry must contain at least one item; the transactional access method enforces this because MySQL CHECK constraints cannot inspect child tables. An inaccessible recipe cannot be logged.
- Entry timestamps are stored as UTC. Daily queries will use boundaries for Asia/Manila, rather than the database server's date. Historical recipe changes and food colour corrections currently affect derived entry colours; immutable meal snapshots are deferred.
- Posts link to an optional recipe. Reactions, comments and attachments become `post_reactions`, `post_comments` and `post_attachments`. A reaction is a single like per user; other reaction types are outside the MVP.
- Posts and comments have moderation state. Only approved public posts are available anonymously. Authors can read their own pending/private posts; admins and moderators can review all posts. Private meal logs remain private even to moderators and admins through the implemented access methods.
- Friends and shares remain stretch goals from the supplied brief. No friend/share arrays, counts or nonfunctional friends-only setting are introduced. Posts currently support public/private. A later friendship migration must add accepted mutual friendships before friends-only posts are offered.
- Entry/friend counts are computed when needed, not stored. Friend counts have no query yet because friendships are deferred.
- `food_sources` records citation, URL, retrieval date, licence and an explicit reuse-review flag. Food nutrients are nullable decimals per 100 g edible portion. NULL means unavailable, not zero; ingestion will flag missing values. No invented food or nutrient records ship with these migrations.
- Colour groups are red, orange/yellow, green, blue/purple and white/brown. Classification may remain NULL pending source review. Four distinct fruit/vegetable groups meet the product rule. Grains remain browsable/loggable but do not contribute to the fruit/vegetable rainbow. Source-grounded mapping and preparation distinctions belong in the food-import slice.
- Attachments store a private storage key rather than a public URL. Type and size constraints supplement, but do not replace, future server MIME/magic-byte validation. Uploads, recipe images, signed URLs and the private storage provider are not implemented in this slice.
- The old restaurant/place feature is not part of this MVP schema. Its UI and legacy Supabase integration remain until the product pages are replaced.

## Access enforcement in MySQL

MySQL has no Postgres-style RLS. `lib/data-access.ts` is a server-only entry point. It reads the session cookie, uses parameterized statements, and resolves the actor from the session hash in the database. Request bodies never supply an authoritative user ID or role. `lib/access.mjs` is the testable query implementation; it must only be called from server modules. There are no new public routes in this slice.

The application database account should have SELECT/INSERT/UPDATE/DELETE only on its application database, with no global, FILE, CREATE USER or GRANT privileges. Use a separate migration account with schema permissions. The app must never give browser clients database credentials. MySQL authorization is an application boundary: direct database access with the app credential can bypass it, unlike RLS. Keep that credential server-side.

Only the access methods already implemented are available: own profile, own entry, transactional entry creation, visible post read and moderation. Future endpoints for preferences, recipes, comments, attachments, favourites, profile updates and administration must add their own scoped queries and integration tests before exposure. A moderator role does not imply permission to manage accounts or foods. Admin endpoints will require both route protection and a fresh handler role check.

## Migration behavior

Numbered SQL files are applied in order with checksums and a named lock. MySQL DDL commits implicitly, so an incomplete migration is recorded and cannot be silently retried. Inspect and repair partial DDL before marking recovery complete. Do not edit a migration after it has been applied. The runner executes repository SQL only; user values always use placeholders. Keep migration files to simple statements separated by semicolons; stored procedures and semicolons in string literals require a parser upgrade.

No production database is created or modified automatically. Tests use an explicitly named, empty `palleteplate_test_*` database. Integration tests retain their fixture database for inspection; use a new empty database for the next run.

## Remaining security work

The existing Supabase authentication uses browser-accessible sessions and legacy map writes bypass the planned server validation. These paths are not part of the MySQL access boundary and are not production-ready under the new brief. Server login/verification, rate limits, CSRF protection, CSP, private uploads, admin routes and food import validation are pending. The MySQL connection is server-only and requires certificate-verified TLS in production. The requested `/security-review` command is not available in this environment; this slice receives code review and database integration tests instead, without claiming that command ran.
