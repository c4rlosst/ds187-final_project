# Nourio

Nourio is a nutrition cookbook built with Next.js, with MySQL planned as its database.

- **Recipes**: nutritious recipes with nutrition per serving and ingredient filters.
- **Map**: discover food places, search addresses, and log places.

## Database transition

The previous Supabase/PostgreSQL schema and sample data files have been removed. MySQL schema, connection configuration, and data migration have not been implemented yet.

The existing data access and sign-in code still uses Supabase. Those connections need to be replaced as part of the MySQL migration before database-backed features can work independently of Supabase. MySQL credentials must stay on the server and must not use `NEXT_PUBLIC_` environment variables.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Database-backed pages and sign-in currently require the existing Supabase configuration until their migration is complete.

## Project layout

- `app/`: home, recipes, recipe details, map, and login pages
- `components/`: recipe browser, map, and account interface
- `lib/`: data access, types, and ingredient filtering
- `utils/supabase/`: existing clients awaiting migration

## Notes

Map tiles and address search use OpenStreetMap and Nominatim.
