# Food Business Registration Platform

Next.js (App Router) application that recreates the GOV.UK food business registration journey. Each step saves JSON payloads to AWS S3 so that progress is persisted without a database.

## Tech Stack

- Next.js 15 (App Router, Route Handlers)
- TypeScript + React 19 + React Server Components
- TailwindCSS with a GOV.UK inspired theme
- shadcn/ui form primitives + react-hook-form + zod validation
- AWS SDK v3 (`@aws-sdk/client-s3`) for storage

## Key Features

- `/register/start` captures email and address (using Google Places Autocomplete) and creates a `registrationId` cookie.
- `/register/legal-entity` chooses the legal entity which unlocks a tailored detail form.
- Conditional detail pages for sole traders, partnerships, limited companies, and organisations/charities/trusts.
- `/register/review` loads all saved JSON files and provides GOV.UK-style "Change" links.
- `/register/submit` merges every step, persists `final.json`, sends email notifications, and redirects to confirmation.
- **Email notifications:** Admin receives notification when a registration is submitted; user receives confirmation email.
- **Admin dashboard:** `/admin/registrations` - View all registrations (password protected).

## Environment Variables

Create a `.env.local` file with the required credentials:

### Required for Basic Functionality
```
AWS_ACCESS_KEY_ID=XXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXX
AWS_REGION=eu-west-2
AWS_S3_BUCKET=food-registration-bucket
NEXT_PUBLIC_GOOGLE_PLACES_KEY=your_google_places_api_key_here
```

**Note:** If AWS credentials are not provided, the app will use local file storage in the `.data/` directory.

### Required for Email Notifications
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
ADMIN_EMAIL=admin@example.com
```

### Required for Admin Access
```
ADMIN_EMAIL=admin@example.com
```
**Note:** Admin access is granted by email. Use the same email address set in `ADMIN_EMAIL` to login to `/admin/login`.

The application writes files to `s3://<bucket>/registrations/<registrationId>/` (or `.data/registrations/<registrationId>/` for local storage).

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
