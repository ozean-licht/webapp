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

## Technologies Used

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ESLint
- shadcn/ui (prepared for integration)
- Supabase (Database & Authentication)