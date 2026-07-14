# Friendship Academy — Website

A production-ready school website: a public marketing site plus a protected
admin dashboard for managing content, news, staff, gallery images, and
contact messages — backed by a real, hosted **Supabase** database (Postgres +
Auth + file storage).

**Stack:** React 19 + Vite, Tailwind CSS v4, React Router v7, Supabase,
lucide-react, react-toastify.

---

## 1. Set up Supabase (one-time)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → New query → paste the entire contents of
   [`supabase/schema.sql`](./supabase/schema.sql) → **Run**.
   This creates all tables, Row Level Security policies, and a public
   `media` storage bucket for uploaded images.

   *Already ran `schema.sql` before and just pulled a newer copy of this
   project?* Also run [`supabase/migration_gallery_events.sql`](./supabase/migration_gallery_events.sql)
   once — it adds the gallery "albums" table used by the Gallery page below.
   It's safe to run `schema.sql` again too; every statement is idempotent.
3. Create your admin login: **Authentication → Users → Add user**. Use the
   email/password you want to sign in with on `/admin/login`.
4. Copy your **Project URL** and **anon public key** from
   **Settings → API**.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is meant to be public — it's safe to ship in frontend code.
Security is enforced by the Row Level Security policies in `schema.sql`
(public read access; writes require a signed-in admin).

## 3. Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Sign in at `/admin/login` with the user you
created in step 1.3.

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Folder Structure

```
supabase/
└── schema.sql            # Tables, RLS policies, storage bucket — run once

src/
├── lib/
│   ├── supabaseClient.js  # Supabase client singleton
│   └── storage.js         # uploadImage() helper (Supabase Storage)
├── api/                   # One file per resource; Supabase queries + demo fallback
│   ├── auth.js
│   ├── content.js
│   ├── news.js
│   ├── staff.js
│   ├── gallery.js
│   └── messages.js
├── components/
│   ├── layout/             # Navbar, Footer, PublicLayout
│   ├── admin/               # AdminSidebar, AdminLayout, ProtectedRoute, AdminPageHeader, ConfirmDialog
│   └── ui/                   # Spinner, Modal, Pagination, SectionHeading, StatCard, PageHero, Crest, SocialIcons, Reveal
├── context/
│   ├── AuthContext.jsx      # Admin auth state (Supabase session)
│   └── AdminLangContext.jsx # Admin dashboard EN/Amharic toggle
├── hooks/
│   └── useReveal.js         # Scroll-reveal animation hook
├── data/
│   ├── mockData.js          # Demo content (used if Supabase is unreachable)
│   ├── homeTranslations.js  # Homepage EN/Amharic copy
│   └── adminTranslations.js # Admin dashboard EN/Amharic copy
├── pages/                    # One file per public route
│   └── admin/                  # Login, Dashboard, ContentEditor, NewsManager, StaffManager, GalleryManager, Messages
├── utils/
│   └── format.js
├── App.jsx                    # Route table
└── main.jsx                    # Entry point (Router + AuthProvider)
```

---

## How data flows

Every function in `src/api/*` queries Supabase directly using the client
library (no separate backend server needed). If a query fails — for example,
before you've run `schema.sql` — it falls back to the sample content in
`src/data/mockData.js`, so the site is still fully browsable. Once your
tables exist, real data takes over automatically.

Image uploads (hero image, news covers, staff photos, gallery images) go
through `uploadImage()` in `src/lib/storage.js`, which uploads the file to
the public `media` bucket and stores the resulting URL on the row.

### Tables

| Table      | Used by                                              |
|------------|-------------------------------------------------------|
| `content`  | Homepage / About page copy, hero image, stats          |
| `news`     | News list, News detail, Home "Latest News"              |
| `staff`    | Staff directory, About page faculty grid                |
| `gallery`  | Gallery page                                             |
| `gallery_events` | Gallery "albums" — year (E.C.) + Amharic event name, grouping gallery photos |
| `messages` | Contact form submissions, Admin → Messages               |

Academic content (grade levels, subjects, programs, calendar) isn't backed
by a table yet — it's served from `mockData.js`. Add an `academics` table +
API file the same way as the others if you want it editable too.

### Gallery albums

Gallery photos can be grouped into **albums** — one per school event, shown
on the public Gallery page as a card with its Ethiopian calendar year and
Amharic name (e.g. "2017 E.C. — የወላጆች ቀን / Parent-Teacher Conference Day").
Clicking a card pops open that event's photos; clicking a photo opens the
fullscreen lightbox.

- Manage albums from **Admin → Gallery Manager**: the upload form lets you
  pick an existing album or create a new one inline (year E.C. + Amharic
  title + optional English title).
- Photos aren't required to belong to an album — un-albumed photos still
  show in a "More Photos" grid below the album cards, filterable by the
  same category chips as before.
- Deleting an album keeps its photos; they just become un-albumed.

### Admin auth

Admin sign-in uses **Supabase Auth** (email + password). There's no
separate `/api/auth/login` — the frontend calls
`supabase.auth.signInWithPassword()` directly, and `ProtectedRoute` checks
for an active session. Add/remove admin users any time from
**Authentication → Users** in the Supabase dashboard.

---

## Design Notes

- **Palette:** bright violet/purple (`--color-plum-*`, `--color-ink-950`)
  with a restrained antique-brass accent, on a warm off-white background —
  defined as Tailwind v4 `@theme` tokens in `src/index.css`.
- **Type:** Fraunces (display/serif) for headings, Inter for body text,
  Noto Sans Ethiopic as a fallback for Amharic text.
- **Signature mark:** a two-ring monogram "seal" (`components/ui/Crest.jsx`)
  used in the navbar, footer, and login screen.
- **Language toggle:** both the homepage hero and the admin dashboard have
  an EN / አማ toggle. Homepage copy lives in `data/homeTranslations.js`;
  admin chrome (sidebar, headers, buttons) lives in
  `data/adminTranslations.js`. Both are hardcoded translations — "Friendship"
  is rendered as "ወዳጅነት" in Amharic mode.
- **Animations:** scroll-reveal on section entry (`components/ui/Reveal.jsx`
  + `hooks/useReveal.js`), a staggered hero entrance, hover micro-interactions
  (`.lift-hover`), and fade/scale transitions on modals and the gallery
  lightbox — all defined in `src/index.css` and respecting
  `prefers-reduced-motion`.
- Fully responsive; mobile nav collapses into a slide-down menu, admin
  sidebar collapses into a drawer below `lg`.
- Loading states use a shared `Spinner`; success/error feedback uses
  `react-toastify`.

## Replacing the Maps embed

Update `mapEmbedUrl` via the Content Editor's underlying `content` table (or
directly in Supabase) with your real Google Maps embed URL.
