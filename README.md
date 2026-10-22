# Nourio

Nourio is a nutrition cookbook built with Next.js and Supabase.

- **Recipes**: nutritious recipes with approximate nutrition per serving. Filter by the ingredients you want (match all or any selected).
- **Map**: a map of food places. Anyone can search an address and log a new place.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root with your Supabase project URL and publishable key (Supabase dashboard, Connect button):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

3. Create the database. In the Supabase SQL editor, run these files in order:

   1. `supabase/schema.sql` creates the tables, constraints and row level security policies.
   2. `supabase/seed.sql` adds sample recipes, ingredients and a few sample places. Both files can be re-run safely.

4. Set up sign-in. The site uses Supabase Auth with email and password. In the Supabase dashboard, under Authentication:
   - For quick local testing, turn off "Confirm email" (Sign In / Providers, Email). People can then sign up and sign in straight away.
   - If you keep "Confirm email" on, set the Site URL to `http://localhost:3000` and add `http://localhost:3000/**` to the Redirect URLs, so the confirmation link brings people back to the site.

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

Free Supabase projects pause after a week of inactivity. If the pages say they could not reach Supabase, restore the project from the Supabase dashboard.

## Project layout

- `app/` pages: home, `recipes`, `recipes/[id]`, `map`
- `components/` the recipe browser and the Leaflet map
- `lib/` data access, types and the ingredient filter
- `utils/supabase/` browser and server Supabase clients
- `supabase/` database schema and sample data

## Notes

- Places can be logged by anyone without signing in. Visitors cannot edit or delete places; do that in the Supabase dashboard (the seed's sample places can be removed with `delete from public.places where name like 'Sample %';`).
- Map tiles and address search use OpenStreetMap and Nominatim, which need no API key but are meant for light use.
- Nutrition values in the sample data are approximate.
