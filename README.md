# Ozean Licht

A Next.js application built with TypeScript, Tailwind CSS, and ESLint.

**Latest deployment fix applied**

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Integration

This project is configured to work with Supabase. To set up Supabase:

### 1. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://suwevnhwtmcazjugfmps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 2. Get Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `suwevnhwtmcazjugfmps`
3. Go to Settings → API
4. Copy the following values:
   - **Project URL**: Already configured as `https://suwevnhwtmcazjugfmps.supabase.co`
   - **anon/public key**: Add this to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Using Supabase in Components

```typescript
import { supabase } from '@/lib/supabase'

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Example: Authentication
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components (prepared for shadcn/ui)
- `lib/` - Utility functions and configurations
- `middleware.ts` - Supabase authentication middleware
- `scripts/` - Development and deployment scripts
- `sql/` - Database migration files
- `assets/` - Static assets and processed images
- `workflows/` - N8N workflow configurations
- `supabase/` - Supabase Edge Functions and configuration

## Supabase Edge Functions

This project includes Supabase Edge Functions for serverless functionality:

### Available Functions

- **send-email** - Handles magic link email sending via Resend

### Function Configuration

Functions are configured in `supabase/config.toml`:

```toml
[functions.send-email]
enabled = true
verify_jwt = false
import_map = "./functions/send-email/deno.json"
entrypoint = "./functions/send-email/index.ts"
```

### Deploying Functions

```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy send-email

# List all functions
npx supabase functions list
```

### Environment Variables (Supabase)

Set these in your Supabase project settings:

```bash
# Email service
RESEND_API_KEY=your_resend_api_key

# Webhook verification
SEND_EMAIL_HOOK_SECRET=your_webhook_secret
```

## Course Import & Thumbnail Processing

### Scripts Overview

All development and deployment scripts are organized in the `scripts/` directory:

```bash
# Start development server
npm run dev

# Course synchronization scripts
npm run sync:airtable          # Sync courses from Airtable (preview)
npm run sync:all               # Sync all courses from Airtable

# Or run scripts directly:
node scripts/sync-airtable-courses.js sync     # Sync courses (LOW LOAD VERSION - 2 per batch, 3s delay)
node scripts/sync-airtable-courses.js sync 5   # Sync only first 5 courses for testing
node scripts/sync-airtable-courses.js preview  # Preview courses from Airtable

# Thumbnail processing
node scripts/fix-missing-thumbnails.js         # Fix missing thumbnails
node scripts/test-thumbnail-fix.js             # Test thumbnail processing

# Testing scripts
npm run test:function                           # Run various function tests
npm run test:webhook                           # Test webhook functionality
```

### Thumbnail Processing Problem & Solution

#### Problem: Nur die ersten 3 Bilder wurden verarbeitet

**Ursache:** Die Edge Function war zu komplex und überlastet bei gleichzeitiger Verarbeitung mehrerer Kurse.

**Symptome:**
- ✅ Erste 3 Kurse: Bilder laden erfolgreich
- ❌ Restliche Kurse: Zeigen Fallback-Design
- ❌ Edge Function überlastet bei Batch-Processing

#### Lösung implementiert:

1. **Vereinfachte Edge Function** - Entfernt komplexe Kompressionsalgorithmen
2. **Reduzierte Batch-Größe** - Nur 2 Kurse gleichzeitig statt 5
3. **Längere Delays** - 3 Sekunden zwischen Batches statt 2
4. **Robuste Fehlerbehandlung** - Fortsetzung bei einzelnen Fehlern

### Thumbnail-Fix durchführen:

```bash
# 1. Teste die neue Edge Function
node scripts/test-thumbnail-fix.js

# 2. Repariere fehlende Thumbnails
node scripts/fix-missing-thumbnails.js

# 3. Überprüfe das Ergebnis auf localhost:3001/courses
```

## Technologies Used

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ESLint
- shadcn/ui (prepared for integration)
- Supabase (Database & Authentication)
- Supabase Edge Functions (Serverless)
- Resend (Email Service)