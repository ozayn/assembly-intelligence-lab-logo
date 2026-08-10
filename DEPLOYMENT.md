# Deployment Guide: Assembly Intelligence Lab to Vercel

## Prerequisites
- GitHub account (free)
- Vercel account (free at vercel.com)
- Supabase account (free at supabase.com)
- Git installed on your computer

## Phase 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Name: `assembly-intelligence-lab`
4. Database password: (generate and save it securely)
5. Region: Select closest to your location
6. Wait for project to initialize (~2 minutes)

### 1.2 Create Feedback Table
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
create table logo_feedback (
  id uuid default gen_random_uuid() primary key,
  round integer default 1,
  reviewer_name text not null,
  concept_id integer not null,
  like_static boolean default false,
  like_animation boolean default false,
  tags text[] default array[]::text[],
  comment text default '',
  created_at timestamp default now()
);

create index idx_round_reviewer on logo_feedback(round, reviewer_name);
create index idx_concept on logo_feedback(concept_id);
```

4. Click **Run**

### 1.3 Get Supabase Credentials
1. In Supabase, go to **Project Settings** → **API**
2. Copy these three values:
   - **Project URL** (looks like `https://xyz.supabase.co`)
   - **Anon Key** (public, safe to expose to browser)
   - **Service Role Key** (keep private, server-only)

## Phase 2: Prepare Project for Deployment (5 minutes)

### 2.1 Create `.env.local` file
In the project root (`/Users/oz/Dropbox/2026/assembly-intelligence-lab/`), create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace the values with your actual Supabase keys.

### 2.2 Test Locally
```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
npm install
npm run build
```

Verify build succeeds without errors.

### 2.3 Create `.env.production` (optional documentation)
Create `.env.production.example` to document which vars are needed:

```
# Same structure as .env.local but with placeholder values
# This file is for documentation only
```

## Phase 3: Deploy to Vercel (10 minutes)

### Option A: GitHub + Vercel (Recommended for Continuous Deployment)

#### Step 1: Create GitHub Repository
```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
git init
git add .
git commit -m "Initial commit: Assembly Intelligence Lab logo explorer"
```

#### Step 2: Create GitHub Repo Online
1. Go to https://github.com/new
2. Repository name: `assembly-intelligence-lab`
3. Description: "Interactive logo concept exploration for Assembly Intelligence Lab"
4. Make it **Private** (for now, if team-only)
5. Click **Create repository**

#### Step 3: Push to GitHub
Copy the commands from GitHub and run them:
```bash
git remote add origin https://github.com/YOUR-USERNAME/assembly-intelligence-lab.git
git branch -M main
git push -u origin main
```

#### Step 4: Connect to Vercel
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Paste: `https://github.com/YOUR-USERNAME/assembly-intelligence-lab`
4. Click **Continue**
5. Click **Deploy** (Vercel auto-detects Next.js)

#### Step 5: Add Environment Variables to Vercel
1. After deployment, go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add three variables:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: (your Supabase URL)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: (your Anon Key)
   - Name: `SUPABASE_SERVICE_ROLE_KEY` → Value: (your Service Role Key)
4. Ensure each is set for all environments (Production, Preview, Development)
5. Click **Save**

#### Step 6: Redeploy
1. In Vercel dashboard, click **Deployments**
2. Click the three dots on the most recent deployment
3. Click **Redeploy**
4. Wait for deployment to complete

#### Step 7: Test
- Visit the URL shown in Vercel (e.g., `https://assembly-intelligence-lab.vercel.app`)
- Test the feedback form
- Check `/admin` page

### Option B: Vercel CLI (Simpler, No GitHub Required)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
vercel
```

Answer the prompts:
- "Set up and deploy?" → `y`
- "Which scope?" → Your personal account
- "Link to existing project?" → `n`
- "Project name?" → `assembly-intelligence-lab`
- "Detected Next.js" → press Enter to continue

#### Step 3: Add Environment Variables
1. After first deployment, go to https://vercel.com/dashboard
2. Click on your `assembly-intelligence-lab` project
3. Go to **Settings** → **Environment Variables**
4. Add the three Supabase variables (as above)
5. Redeploy: `vercel --prod`

## Phase 4: Automate Future Updates

### Workflow After Deployment

**Using GitHub (Option A):**
```bash
# Make local changes to logos or code
git add .
git commit -m "Update logo concept 3: improved interlocking"
git push origin main
```
→ Vercel automatically redeploys within ~1 minute

**Using Vercel CLI (Option B):**
```bash
# Make local changes
vercel --prod
```
→ Instantly deploys to production

## Environment Variables Explained

| Variable | Purpose | Where to Use | Safe to Expose? |
|----------|---------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase endpoint | Browser (API calls) | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Browser (read/write) | ✅ Yes (limited permissions) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Server-side only | ❌ Never expose to browser |

**Important:** The `NEXT_PUBLIC_` prefix means the variable is embedded in the browser. Only use this for keys that are safe to expose (like the Anon key, which has row-level security).

## Troubleshooting

### "Supabase connection failed"
- Verify env variables are spelled correctly (case-sensitive)
- Check Supabase project is active
- Confirm table `logo_feedback` exists

### "Build failed on Vercel"
- Check `npm run build` works locally
- Verify all imports are correct
- Check Console logs in Vercel dashboard

### "Animations not working after deployment"
- This shouldn't happen, but if it does:
  - Ensure `framer-motion` is in `package.json`
  - Verify `prefers-reduced-motion` CSS is present
  - Check browser console for JS errors

### "Environment variables not loading"
- Variables take ~1 minute to propagate
- Redeploy after adding variables
- Verify variables show in Vercel dashboard (they show as masked)

## Next Steps

### Phase 2 Features (Recommended order)
1. **Logo Downloads** - SVG/PNG exports
2. **Squarespace Variants** - Multiple marks per concept
3. **Real-world Previews** - Header/mobile/favicon mockups
4. **Advanced Analytics** - Download tracking, preference patterns

### After First Deployment
- Share Vercel URL with team
- Collect feedback via `/admin`
- Update concepts locally
- Push to GitHub/Vercel (auto-redeploys)
- Iterate

## Support

If you encounter issues:
1. Check Vercel docs: https://vercel.com/docs
2. Check Supabase docs: https://supabase.com/docs
3. Check Next.js docs: https://nextjs.org/docs
