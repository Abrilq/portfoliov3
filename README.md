# John Clarence Legaspi — Portfolio

A content-managed portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. Public pages use five-minute ISR; the protected admin studio edits content without code changes or a redeploy.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS 4 with a small portfolio-specific CSS layer
- Supabase Postgres, Row Level Security, and Supabase Auth
- React Hook Form and Zod for admin forms and server-side validation
- Tiptap for project case-study bodies
- Next.js server actions with path and data-cache revalidation

## Setup

1. Install dependencies with `npm install`.
2. Create a Supabase project and run [`schema.sql`](schema.sql) in its SQL editor. It creates the tables, seed content, and public/admin RLS policies.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project settings in your local environment. `.env.example` shows the variable names; keep secret/service-role keys out of browser-exposed variables.
4. Create an Auth user for the site owner. In Supabase Auth, assign this user the server-managed app metadata claim `{ "role": "admin" }`. The admin routes and database write policies both require this claim.
5. Run `npm run dev` and open `http://localhost:3000`.

The public portfolio has local fallback content until Supabase is configured. `/admin/login` requires Supabase configuration. Public content refreshes on a five-minute ISR interval; successful admin saves also invalidate the public data tag and affected paths.

## Content editing

The admin studio at `/admin` manages the profile, work experience, projects, and certifications. Project bodies are edited with Tiptap and sanitized on save and read. Each collection supports publishing controls; projects also support homepage featuring, sort order, tags, and live/source links.

Never use a Supabase service-role key in this app. Public reads use the anon/publishable key and RLS; authenticated admin writes use the signed-in user's session and the `app_metadata.role` claim.