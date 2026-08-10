# Complete Setup Guide: Supabase + Vercel Deployment

This guide walks you through everything needed to get Assembly Intelligence Lab live on Vercel with a working feedback system.

**Estimated Time**: 1 hour (first time)  
**Subsequent updates**: 2 minutes (edit local code → `git push` → auto-deployed)

---

## Part 1: Local Testing (15 minutes)

Before deploying anywhere, verify the project works locally.

### Step 1.1: Verify Build
```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
npm run build
```

**Expected output**: Build completes successfully with no errors
**Status**: ✅ Already done (confirmed just now)

### Step 1.2: Run Dev Server Locally
```bash
npm run dev
```

Visit http://localhost:3000 in your browser. Verify:
- ✅ Page loads
- ✅ Header and controls are visible
- ✅ All 12 logo concepts display
- ✅ Static view works
- ✅ Animated view works
- ✅ Light/Dark theme toggle works
- ✅ Size controls (64px, 32px, 16px) work
- ✅ Logos are visible in LIGHT MODE (this was the bug that's now fixed)

If all works, you're good to proceed.

---

## Part 2: Set Up Supabase (20 minutes)

Supabase is a PostgreSQL database that will store all feedback submitted by reviewers.

### Step 2.1: Create Supabase Account
1. Go to https://supabase.com
2. Click **Sign Up**
3. Sign up with your email (or GitHub account)
4. Verify your email
5. You're now logged into Supabase

### Step 2.2: Create a New Project
1. In Supabase dashboard, click **New Project** (or **+** button)
2. Fill in:
   - **Name**: `assembly-intelligence-lab`
   - **Database Password**: (generate a strong password and SAVE IT somewhere safe)
   - **Region**: Select the region closest to you (or US-East-1 if unsure)
3. Click **Create new project**
4. Wait for it to initialize (~2 minutes) — you'll see a progress bar

### Step 2.3: Create the Feedback Table
Once the project initializes, you'll see the dashboard. Now create the table for storing feedback:

1. In the left sidebar, click **SQL Editor**
2. Click **New Query**
3. Paste this SQL exactly:

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

4. Click **Run** (play button)
5. You should see a green checkmark — table created successfully

### Step 2.4: Get Your Supabase API Keys
You need three values. In Supabase dashboard:

1. Click **Project Settings** (gear icon, bottom-left)
2. Click **API** (left menu)
3. You'll see a section with API keys. Copy these THREE values:

```
NEXT_PUBLIC_SUPABASE_URL = the "Project URL" (looks like: https://xyz.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY = the "public anon key" (long string starting with eyJ...)
SUPABASE_SERVICE_ROLE_KEY = the "service_role key" (long string, only visible once)
```

**IMPORTANT**: The Service Role Key is only shown once. Save it now or you'll need to regenerate it later.

### Step 2.5: Add Keys to Local `.env.local`
On your computer, create (or update) `.env.local` in the project root:

```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
nano .env.local
```

Paste this, replacing with your actual values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-long-service-role-key-here
```

Save with Ctrl+O, Enter, Ctrl+X.

### Step 2.6: Test Feedback Locally
1. Restart the dev server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000
3. Enter a test name (e.g., "Test Reviewer")
4. Like a concept, add tags, write a comment
5. Click "Submit Feedback"
6. Wait for success message
7. Visit http://localhost:3000/admin
8. You should see your feedback in the admin dashboard

**If feedback appears**: ✅ Supabase is working!  
**If feedback doesn't appear**: Check env vars are correct, restart server, try again

---

## Part 3: Deploy to Vercel (25 minutes)

### Step 3.1: Prepare Git Repository
If not already done, initialize git:

```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
git init
git add .
git commit -m "Initial commit: Assembly Intelligence Lab logo explorer with feedback system"
```

### Step 3.2: Create GitHub Repository
1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `assembly-intelligence-lab`
   - **Description**: "Interactive logo concept exploration for Assembly Intelligence Lab"
   - **Privacy**: Choose **Private** (for team-only access)
   - **Do NOT initialize** (we already have git locally)
3. Click **Create repository**

### Step 3.3: Push Code to GitHub
GitHub will show you commands to run. In your terminal:

```bash
cd /Users/oz/Dropbox/2026/assembly-intelligence-lab
git remote add origin https://github.com/YOUR-USERNAME/assembly-intelligence-lab.git
git branch -M main
git push -u origin main
```

**What this does**: Uploads your code to GitHub

### Step 3.4: Connect to Vercel
1. Go to https://vercel.com
2. Sign up if you don't have an account (GitHub login is easiest)
3. Click **Add New** → **Project**
4. Click **Import Git Repository**
5. Paste: `https://github.com/YOUR-USERNAME/assembly-intelligence-lab`
6. Click **Continue**
7. Leave settings as default (Vercel auto-detects Next.js)
8. Click **Deploy**

Vercel will build and deploy. Wait for the green checkmark (usually 2-3 minutes).

### Step 3.5: Add Environment Variables to Vercel
Once deployed:

1. Go to your Vercel project dashboard
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. Add three variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your anon key) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (your service role key) |

5. For each variable, make sure all three environment checkboxes are checked (Production, Preview, Development)
6. Click **Save**

### Step 3.6: Redeploy with Env Vars
Vercel needs to rebuild with the new env vars:

1. Go to **Deployments** (top menu)
2. Find the latest deployment (top of list)
3. Click the three dots (•••) menu
4. Click **Redeploy**
5. Wait for green checkmark

### Step 3.7: Test Live Site
1. In Vercel dashboard, copy your deployment URL (looks like `https://assembly-intelligence-lab.vercel.app`)
2. Visit it in your browser
3. Enter a test reviewer name
4. Submit feedback on one concept
5. Go to `/admin` (add `/admin` to end of URL)
6. Verify feedback appears

**If feedback appears**: ✅ You're live!  
**If no feedback**: Check env vars in Vercel Settings are correct, redeploy again

---

## Part 4: Share with Team

Once live on Vercel, share the URL with your Assembly Intelligence Lab team:

```
https://your-project.vercel.app
```

Tell them:
> "Visit this link to review logo concepts. Enter your name, view each logo, submit feedback. All feedback is captured and I can see results at /admin"

---

## Part 5: Update Workflow (Going Forward)

This is the fast part. Once deployed:

### To Update Logo Concepts

1. **Edit locally**: Modify logo files (e.g., `components/logos/Concept03Emergence.tsx`)
2. **Test locally**: `npm run dev` → verify changes
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Refine concept 3: improved clarity at small sizes"
   git push origin main
   ```
4. **Vercel auto-deploys** (watch dashboard, should complete in ~2 minutes)
5. **Share updated URL** with team

That's it! No more manual deployment needed.

### To View Feedback Results

Visit: `https://your-project.vercel.app/admin?round=1`

Shows:
- All reviewers and their names
- Per-concept like counts (static vs animation)
- All feedback tags and written comments
- Preference matrix (who liked what)
- Round filtering (for tracking Round 1, Round 2, Round 3 separately)

---

## Troubleshooting

### "Feedback not saving" after deployment
- Check env vars in Vercel Settings (make sure they're all set to Production)
- Verify table was created in Supabase (SQL Editor → tables should show `logo_feedback`)
- Try submitting feedback again (might be a timing issue)

### "Logos don't render on Vercel"
- This shouldn't happen (you built locally), but if it does:
  - Check build logs in Vercel (Deployments → click build → Logs tab)
  - Verify all files were pushed to GitHub (`git status` locally should be clean)

### "Animations don't work after deployment"
- Animations should work (they're CSS/JS, not server-side)
- Check browser console (F12 → Console tab) for JavaScript errors
- Verify `framer-motion` is in `package.json` (it is)

### "Can't access /admin on Vercel"
- Add `/admin` to the end of your URL (e.g., `https://assembly-intelligence-lab.vercel.app/admin`)
- Refresh page
- If still blank, check that your env vars are set (step 3.5)

### Service Role Key is gone / I can't find it
- In Supabase Project Settings → API
- Click **Regenerate** next to "service_role key"
- Copy the new key immediately
- Update your `.env.local` and Vercel Settings

---

## Security Notes

### For This Prototype
- ✅ No row-level security (RLS) configured (fine for internal team review)
- ✅ Public Anon Key is safe to expose (limited permissions)
- ❌ Service Role Key must stay private (never commit to GitHub, keep it in Vercel env vars only)
- ✅ Private GitHub repository (team-only access)

### If Making Public Later
Before sharing with external audiences:
1. Enable RLS in Supabase
2. Configure policies to prevent unauthorized access
3. Consider anonymizing reviewer names
4. Set up backup strategy

---

## Next Steps After Deployment

1. **Share with team** → collect first round of feedback
2. **Review results** on `/admin` dashboard
3. **Identify strong concepts** (high like rates)
4. **Iterate** on top concepts locally
5. **Push updates** to GitHub → auto-deploy
6. **Collect round 2 feedback** (data preserved by round number)

For Phase 2 features (downloads, Squarespace variants), see PROJECT_STATUS.md

---

## Quick Reference

| Task | Command/URL |
|------|------------|
| Run locally | `npm run dev` → http://localhost:3000 |
| Build for production | `npm run build` |
| View feedback locally | http://localhost:3000/admin |
| Push updates to live | `git push origin main` (Vercel auto-deploys) |
| View feedback on live | https://your-project.vercel.app/admin |
| Supabase dashboard | https://supabase.com/dashboard |
| Vercel dashboard | https://vercel.com/dashboard |
| GitHub repository | https://github.com/YOUR-USERNAME/assembly-intelligence-lab |

---

**You're all set! Questions? Check the README.md, PROJECT_STATUS.md, or DEPLOYMENT.md for more details.**
