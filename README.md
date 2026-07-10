# Mads Project Website + Portal

Modern pt-BR one-page website for Mads Project, plus a static-export friendly student portal backed by Supabase Free Plan services.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS v4
- Motion for polished client animations
- Supabase Auth, Postgres, Storage, RLS, and Edge Functions
- Static export to `out/` for HostGator shared hosting

The frontend can be hosted as plain static files. The portal backend lives in Supabase, so HostGator does not need to run Node.js.

## Routes

- `/` public website and WhatsApp enrollment form
- `/portal` login
- `/portal/aluno` student downloads
- `/portal/professor` teacher uploads
- `/portal/admin` invites, groups, memberships, storage guardrails, CSV export, and file cleanup

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If these values are empty, the portal shows a setup notice instead of failing.

## Supabase Setup

1. Create one Supabase project.
2. In Supabase SQL Editor, run `supabase/migrations/0001_initial_schema.sql`. If you prefer the Supabase CLI, install it and initialize/link the project first:

```bash
supabase login
supabase init
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

3. Create the first admin user in Supabase Auth, then bootstrap their profile in SQL:

```sql
insert into public.profiles (id, email, full_name, role, active)
values ('AUTH_USER_ID', 'admin@email.com', 'Admin Mads', 'admin', true)
on conflict (id) do update
set role = 'admin', active = true;
```

4. Deploy the invite Edge Function:

```bash
supabase functions deploy invite-user
supabase secrets set SITE_URL=https://your-domain.com
```

The function uses Supabase's built-in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets. Never expose the service role key in the Next.js `.env.local`.

## Portal Rules

- Admins create accounts by invite only.
- Students and teachers log in with the school-registered email.
- For minors, use the guardian/responsible email.
- Teachers upload files only to assigned groups.
- Students download files only from assigned groups.
- RLS and Storage policies enforce access; UI checks are only convenience.
- Default upload limit is 10 MB per file, adjustable in `/portal/admin`.
- Uploaded files are private and downloaded through short-lived signed URLs.

## Free-First Guardrails

- No hosted Node server.
- No realtime features in v1.
- No image transformations.
- No public Storage bucket.
- No paid email marketing integration in v1.
- Admin storage indicator warns at 80% of the 1 GB MVP budget.
- Use PDFs and compressed documents; avoid uploading videos to the portal.

Supabase Free quotas and pausing rules can change, so verify before launch:

- [Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Supabase pricing](https://supabase.com/pricing)
- [Supabase free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)

## Build And Deploy To HostGator

Run:

```bash
npm run lint
npm run build
```

Next.js writes the static site to `out/`. Upload the contents of `out/`, not the folder itself, to HostGator `public_html` or the document root for the domain/subdomain.

Because `trailingSlash: true` is enabled, portal pages are emitted as folders like:

```text
out/portal/index.html
out/portal/aluno/index.html
out/portal/professor/index.html
out/portal/admin/index.html
```

This works well on Apache-style static hosting. If HostGator is serving from a subdomain or addon domain, upload to that domain's configured document root.

Reference docs:

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [HostGator compatible technologies](https://www.hostgator.com/help/article/hg-compatible-technologies)

## Test Checklist

- Public site on desktop and mobile
- WhatsApp enrollment message generation
- Portal setup notice when env vars are missing
- Admin invite flow
- Student, teacher, and admin login
- Teacher upload under the configured size limit
- Student download from assigned group
- Unauthorized group/file access blocked by RLS
- CSV export for opted-in contacts
- Archive and delete old files

## Marketing Readiness

The database stores `marketing_opt_in`, `marketing_opt_in_at`, `marketing_source`, and `unsubscribed_at`. V1 only exports opted-in contacts as CSV. Later, connect a low-cost email provider only after consent text and unsubscribe process are reviewed.
