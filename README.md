# Food Business Registration Platform

Next.js (App Router) application that recreates the GOV.UK food business registration journey. Each step saves JSON payloads to AWS S3 so that progress is persisted without a database.

## Tech Stack

- Next.js 15 (App Router, Route Handlers)
- TypeScript + React 19 + React Server Components
- TailwindCSS with a GOV.UK inspired theme
- shadcn/ui form primitives + react-hook-form + zod validation
- AWS SDK v3 (`@aws-sdk/client-s3`) for storage

## Key Features

- `/register/start` captures the postcode and creates a `registrationId` cookie.
- `/register/legal-entity` chooses the legal entity which unlocks a tailored detail form.
- Conditional detail pages for sole traders, partnerships, limited companies, and organisations/charities/trusts.
- `/register/review` loads all saved JSON files from S3 and provides GOV.UK-style “Change” links.
- `/register/submit` merges every step and persists `final.json`, then redirects to the confirmation page.

## Environment Variables

Create a `.env.local` file with the required credentials:

```
AWS_ACCESS_KEY_ID=XXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXX
AWS_REGION=eu-west-2
AWS_S3_BUCKET=food-registration-bucket
NEXT_PUBLIC_GOOGLE_PLACES_KEY=your_google_places_api_key_here
```

The application writes files to `s3://<bucket>/registrations/<registrationId>/`.

### Setting Up Google Places API

1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Places API
   - Geocoding API
3. Add the API key to your `.env.local` file
4. **For Vercel deployment**: Add the environment variable in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `NEXT_PUBLIC_GOOGLE_PLACES_KEY` with your API key value
   - Redeploy your application

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — the root route redirects to `/register/start`.

## Production Build

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Folder Structure Highlights

- `app/` – App Router pages and API route handlers.
- `components/` – GOV.UK style UI components, multi-step forms, review cards, etc.
- `lib/` – Zod schemas, AWS S3 helpers, registration utilities, and shared constants.

Everything required to run the registration journey locally or in production is contained in this repository.
