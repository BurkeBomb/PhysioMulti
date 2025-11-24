# Physio AutoQuote – Multi-Client (Physio + Anaesthetic)

Full Vite + React project with:

- Supabase auth
- Per-practice client profile
- Specialty-based quote builders:
  - Physiotherapy
  - Anaesthetist
- Login + Register pages
- Simple, clean UI

## 1. Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your Supabase project details:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Supabase SQL

In the Supabase SQL editor, run:

```sql
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_name text not null,
  specialty text not null check (specialty in ('physio', 'anaesthetic', 'neuro', 'other')),
  contact_name text,
  email text,
  phone text,
  address text,
  registration_no text,
  bank_name text,
  bank_account text,
  bank_branch text,
  logo_url text,
  default_rates jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;

create policy "Users can select their own client"
on public.clients
for select
using (auth.uid() = user_id);

create policy "Users can insert their own client"
on public.clients
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own client"
on public.clients
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3. Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 4. Flow

1. Go to `/register` and create a practice.
   - Choose **specialty** = `physio` or `anaesthetic`.
2. After registering you’ll be redirected to `/app`.
3. The app loads your `clients` row and:
   - Shows the **Physiotherapy quote builder** if `specialty = physio`
   - Shows the **Anaesthetic quote builder** if `specialty = anaesthetic`

You can later add more specialties by:

- Extending the `specialty` enum in the SQL.
- Creating new builder components.
- Updating the `switch` in `src/App.jsx`.

## 5. Deploying to Vercel

1. Push this project to GitHub.
2. Create a new Vercel project from that repo.
3. In Vercel **Environment Variables**, add:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Build & deploy.

Because this is a SPA with `react-router-dom`, Vercel will serve `index.html`
for all routes by default when using the Vite preset.

## 6. Where to plug more logic

- Physiotherapy tariff logic:
  - `src/components/PhysiotherapyQuoteBuilder.jsx`
- Anaesthetic rules (BMI, emergency, time, blocks):
  - `src/components/AnaestheticQuoteForm.jsx`
- Auth and session:
  - `src/context/AuthContext.jsx`
- Per-client data:
  - `src/context/ClientContext.jsx`
- Specialty routing:
  - `src/App.jsx`
