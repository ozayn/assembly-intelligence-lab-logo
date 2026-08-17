# Assembly Intelligence Lab — Logo Concept Exploration

A private, interactive design review platform for exploring 12 distinct logo concepts for Assembly Intelligence Lab. Reviewers can view static and animated versions, provide feedback via Formspree, and test SVG downloads.

**Tech Stack:**
- **Framework:** Next.js 14 (React + TypeScript)
- **Animations:** Framer Motion
- **Styling:** CSS modules + CSS variables (light/dark theme support)
- **Feedback:** Formspree (no database required)
- **Authentication:** Session-based password gate
- **Deployment:** Vercel (auto-deploys on git push)

---

## 1. FIRST-TIME SETUP

### Clone the Repository

```bash
git clone git@github.com:ozayn/assembly-intelligence-lab-logo.git
cd assembly-intelligence-lab-logo
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set the following:

```
# Required: Set a password for the review site
SITE_PASSWORD=your_secure_password_here

# Optional: Supabase (currently not used; Formspree handles feedback)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Never commit `.env.local` to git. It is already listed in `.gitignore`.

---

## 2. RUNNING LOCALLY

### Start the Development Server

```bash
npm run dev
```

The server will start on **http://localhost:3000**

Open your browser and navigate to:
```
http://localhost:3000
```

You will see the password gate. Enter the `SITE_PASSWORD` value you set in `.env.local`.

### What You Can Do Locally

- View all 12 logo concepts in static and animated modes
- Toggle between light and dark themes
- Test individual and global animation controls
- Download SVG files for each concept
- Submit feedback (goes to Formspree dashboard)
- Test responsive layout

---

## 3. STOPPING / RESTARTING

### Stop the Development Server

Press **Ctrl+C** in the terminal where the dev server is running.

### Restart the Server

Simply run:
```bash
npm run dev
```

### Port Already in Use

If port 3000 is already occupied:

**Option A: Kill the process using port 3000**
```bash
lsof -i :3000
kill -9 <PID>
npm run dev
```

**Option B: Run on a different port**
```bash
PORT=3001 npm run dev
```

Then open **http://localhost:3001** in your browser.

---

## 4. PRODUCTION TESTING

### Build for Production

```bash
npm run build
```

This creates an optimized production bundle in the `.next/` directory. The build will report any errors.

### Test the Production Build Locally

After building, run:

```bash
npm run start
```

This launches the production server (without hot-reload). Navigate to **http://localhost:3000** and test all features.

Press **Ctrl+C** to stop.

### Development vs. Production Mode

| Mode | Command | Speed | Use Case |
|------|---------|-------|----------|
| **Development** | `npm run dev` | Fast reloads (HMR) | Active editing, testing |
| **Production** | `npm run build` → `npm run start` | Optimized bundle | Final verification before deploy |

---

## 5. LOGO EDITING GUIDE

### Where Logo Concepts Live

All 12 logo concepts are in:
```
components/logos/
├── Concept01Convergence.tsx
├── Concept02Interlocking.tsx
├── ... (Concepts 03–12)
├── Concept12CollectiveIntelligence.tsx
└── index.ts
```

### File Structure for Each Concept

Each concept file contains two exported functions:

```typescript
// Static version (final assembled logo)
export function Concept0XStatic() {
  return (
    <svg viewBox="0 0 200 200">
      {/* SVG circles with final positions */}
      <circle cx={100} cy={100} r="8" fill="var(--logo-primary)" />
      {/* ... more particles ... */}
    </svg>
  )
}

// Animated version (particles assemble with Framer Motion)
export function Concept0XAnimated() {
  return (
    <svg viewBox="0 0 200 200">
      <motion.circle
        cx={startX}
        cy={startY}
        animate={{ cx: finalX, cy: finalY }}
        transition={{ duration: 2.4, ease: 'easeInOut', delay: 0 }}
      />
      {/* ... more animated particles ... */}
    </svg>
  )
}
```

### How Concepts Are Registered

The `index.ts` file exports all concepts and metadata:

```typescript
export const LOGO_CONCEPTS = [
  {
    id: 1,
    name: 'Hexagon Assembly',
    description: 'Six particles converge...',
  },
  // ... all 12 concepts
]
```

### Modifying a Concept

1. **Open the concept file** (e.g., `Concept01Convergence.tsx`)
2. **Edit the SVG geometry** in the `Static` function:
   - Change `cx`, `cy`, `r` values to reposition/resize particles
   - Adjust `fill="var(--logo-primary)"` to change colors
3. **Edit the animation** in the `Animated` function:
   - Update `startX`, `startY` (where particles begin)
   - Update `finalX`, `finalY` (where particles end)
   - Adjust `delay` and `duration` for timing
4. **Update metadata** in `index.ts`:
   - Change `name` and `description`
5. **Test locally:**
   ```bash
   npm run dev
   ```
   Restart the server to see changes.

### Adding a New Concept

1. Create a new file: `components/logos/Concept13NewName.tsx`
2. Copy the structure from an existing concept (e.g., `Concept01Convergence.tsx`)
3. Edit the SVG geometry and animation data
4. Export both `Concept13Static` and `Concept13Animated` functions
5. Add to `index.ts`:
   ```typescript
   export { Concept13Static, Concept13Animated } from './Concept13NewName'

   export const LOGO_CONCEPTS = [
     // ... existing concepts ...
     {
       id: 13,
       name: 'New Concept Name',
       description: 'Description here',
     },
   ]
   ```
6. Update `app/page.tsx` to include the new concept in `LOGO_COMPONENTS` array

### Removing a Concept

1. Delete the concept file (e.g., `Concept05Equilibrium.tsx`)
2. Remove the export from `index.ts`
3. Remove from `LOGO_CONCEPTS` array in `index.ts`
4. Remove from `LOGO_COMPONENTS` array in `app/page.tsx`

### Color System

Concepts use CSS variables (defined in `app/globals.css`):

```css
--logo-primary: #001e3c (dark navy) or #e6edf3 (light in dark mode)
--logo-accent: #0d8b8f (teal) or #58a6ff (light blue in dark mode)
```

All SVG circles should use:
```tsx
fill="var(--logo-primary)"     // Main particles
fill="var(--logo-accent)"      // Accent particles
```

This ensures colors automatically adapt to light/dark mode.

---

## 6. FEEDBACK SYSTEM

### How Feedback Works

1. **Reviewer enters name** (modal on first visit) → stored in browser localStorage
2. **Reviewer selects a concept** → clicks "Add feedback for this concept"
3. **Feedback form appears** with fields:
   - Static logo like (yes/no)
   - Animation like (yes/no)
   - Feedback tags (predefined options)
   - Comment (free text)
4. **Reviewer submits** → POST to `/api/feedback/submit`
5. **API endpoint** formats data and sends to Formspree
6. **Formspree** sends email notification and stores in dashboard

### Files Involved

- **Form component:** `components/FeedbackForm.tsx`
- **API endpoint:** `app/api/feedback/submit/route.ts`
- **Main review page:** `app/page.tsx` (handles submission logic)

### Viewing Feedback

Feedback is stored on the Formspree dashboard:
```
https://formspree.io/forms/meajayba/submissions
```

You must log in to the Formspree account that created the form (azinfaghihi@gmail.com).

Each submission includes:
- Reviewer name
- Concept number and name
- Static logo like (yes/no)
- Animation like (yes/no)
- Tags
- Comment
- Timestamp

### Testing Feedback Locally

1. Start the dev server
2. Enter the password
3. Review modal should appear asking for your name (first visit only)
4. Click "Add feedback for this concept" on any logo
5. Fill in the form and submit
6. You should see "✓ Submitted!" confirmation
7. Check Formspree dashboard to verify it arrived

### Configuration

Feedback is routed to a specific Formspree form. To change the form:

**Edit** `app/api/feedback/submit/route.ts`:
```typescript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

Never commit actual Formspree URLs or keys to git.

---

## 7. PASSWORD PROTECTION

### How It Works

1. **On first visit:** Password gate blocks access
2. **After entering correct password:** Session token stored in `sessionStorage`
3. **Reviewers see the site** for the rest of their browser session
4. **Closing/reopening browser** requires password again (session storage is cleared)

### Configure Locally

Set `SITE_PASSWORD` in `.env.local`:

```
SITE_PASSWORD=my_secure_password
```

The value can be anything. It's checked server-side by `/api/verify-password`.

### Configure on Vercel (Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Name: `SITE_PASSWORD`
5. Value: your password
6. Environment: Select **Production** (uncheck Preview/Development if not needed)
7. Click **Save**

Vercel automatically redeploys with the new environment variable.

### Change the Password

Simply update the environment variable value:
- **Locally:** Edit `.env.local` and restart `npm run dev`
- **Production:** Update the Vercel environment variable value

### Forgot / Lost Password

You need the actual password value. It's stored only in environment variables (not in code).

**To reset:**
1. Set a new value in `.env.local` (local testing)
2. Update the Vercel environment variable (production)

There is no "forgot password" flow—the password is static and managed by you.

---

## 8. DEPLOYMENT

### Normal Workflow

```bash
# 1. Make edits locally
# (edit files, test with npm run dev)

# 2. Test production build locally
npm run build
npm run start

# 3. Stage changes
git add .

# 4. Commit (with descriptive message)
git commit -m "Add new logo concept / Fix animation timing / etc."

# 5. Push to GitHub
git push origin main

# 6. Vercel auto-deploys
# (GitHub webhook triggers Vercel build)
```

### Verify Deployment Succeeded

1. Watch Vercel dashboard: https://vercel.com/ozayn/assembly-intelligence-lab-logo
2. Look for **green checkmark** next to your latest commit
3. Click the deployment to see build logs
4. Test the live URL once it's ready (usually within 2–3 minutes)

### Live URL

```
https://assembly-intelligence-lab-logo.vercel.app
```

### If Deployment Fails

1. Check Vercel build logs for errors
2. Common issues:
   - Missing environment variables (SITE_PASSWORD, Formspree endpoint)
   - TypeScript type errors
   - Linting failures
3. Fix locally, commit, push again

---

## 9. CURRENT FEATURES

### Implemented Features

| Feature | Where | Status |
|---------|-------|--------|
| **12 Logo Concepts** | `components/logos/` | ✅ All 12 implemented |
| **Static View** | `app/page.tsx` → Display toggle | ✅ Shows final assembled logo |
| **Animated View** | `app/page.tsx` → Display toggle | ✅ Framer Motion particles assemble |
| **Individual Play Assembly** | `LogoCard.tsx` → Play Assembly button | ✅ Replays animation for one concept |
| **Individual Replay** | `LogoCard.tsx` → Replay button | ✅ Restarts animation |
| **Play All** | `app/page.tsx` → Play All button | ✅ Animates all 12 concepts at once |
| **Stop All** | Integrated with Play All (auto-reset after animation) | ✅ Stops running animations |
| **Light Mode** | `app/globals.css` + ThemeProvider | ✅ Navy + teal color scheme |
| **Dark Mode** | `app/globals.css` + ThemeProvider | ✅ Light text + teal accents |
| **Size Testing** | `LogoCard.tsx` → Size previews | ✅ 64px, 32px, 16px previews |
| **Export Size** | `LogoCard.tsx` → Export Size chips | ✅ 16 · 32 · 64 · 128 · 256 · 512 · 1024 · 2048, shown for PNG only; both sides of a square symbol, the **width** of a lockup, whose height follows its own proportions |
| **PNG Download** | Header → Format: SVG / PNG, then "↓ PNG" | ✅ The same artwork drawn to a transparent PNG at that size (`logoExport.ts`) |
| **SVG Download** | `LogoCard.tsx` → "↓ SVG" button | ✅ Always offered, whichever format is set. Carries a viewBox and no fixed size, so it takes the width it is given; a lockup carries its webfonts inside it, so the type holds up wherever the file is opened |
| **Copy SVG** | `LogoCard.tsx` → "Copy SVG" | ✅ The very file that button writes, on the clipboard instead, for pasting into a page's own markup |
| **Animated SVG Download** | `LogoCard.tsx` → "↓ Animated SVG" | ✅ The concept's animation as a file that plays itself, for concepts registered in `logos/animatedMarks.ts` (25, 33, 34, 36, 41 — every final nominee). A concept whose animation is stated as pieces seating into place needs only to hand them to `logos/seatedMark.ts`; one absent from the registry shows no animated export at all |
| **Copy Animation Code** | `LogoCard.tsx` → "Copy Animation Code" | ✅ The same markup on the clipboard, bare, for pasting into a site's custom-code block |
| **Reviewer Name System** | `ReviewerModal.tsx` + `ReviewerContext.tsx` | ✅ Modal on first visit, badge in header |
| **Change Reviewer** | `ReviewerBadge` component | ✅ Click "Change" to switch name mid-session |
| **Password Gate** | `PasswordGate.tsx` + `/api/verify-password` | ✅ Blocks unauthenticated access |
| **Formspree Feedback** | `FeedbackForm.tsx` + `/api/feedback/submit` | ✅ Submissions appear in Formspree dashboard |
| **Responsive Design** | CSS media queries + mobile layout polish | ✅ Works on mobile, tablet, desktop |
| **Accessibility** | `prefers-reduced-motion` support | ✅ Animations respect user preferences |

### Admin Page

- **URL:** `/admin`
- **Current:** Displays message directing to Formspree dashboard
- **Purpose:** Will show feedback analytics if database is added later

---

## 10. FUTURE / FINALIST PRODUCTION

After receiving feedback, the following assets will be created for selected finalist concepts:

### Squarespace Production Animation
- Standalone HTML + inline SVG + CSS animations + vanilla JavaScript
- No React/Framer Motion dependency
- Responsive and works on light/dark backgrounds
- Respects `prefers-reduced-motion`
- Pasteable directly into Squarespace Code Block
- **File location (future):** To be generated in `exports/squarespace/`

### MP4 Animation Export
- Format: H.264 MP4
- Duration: 3–5 seconds
- Starts unassembled, plays assembly sequence, holds on final logo
- Clean background, no audio
- **Generation method:** FFmpeg + headless browser capture (not implemented in-site)
- **File location (future):** To be generated in `exports/mp4/`

### Additional Production Variants (Future)
- ~~Transparent PNG exports~~ — done: the Format control writes any mark or
  lockup as a transparent PNG, rendered from the same SVG the vector export
  writes
- Favicon / micro-mark (favicon-sized version)
- Horizontal / header lockup (if different from square)
- Monochrome version (for accessibility)
- Light mode production variant
- Dark mode production variant

---

## 11. TROUBLESHOOTING

### Page Renders Without Styling

**Symptom:** Page loads but looks blank or unstyled (serif headings, default button styles)

**Solution:**
1. Clear `.next/` directory:
   ```bash
   rm -rf .next
   ```
2. Rebuild and restart:
   ```bash
   npm run dev
   ```
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Why:** Stale build artifacts or CSS not loading during build

---

### Port Already in Use

**Symptom:** "Address already in use" error when running `npm run dev`

**Solution:**

Option A: Kill the existing process
```bash
lsof -i :3000
kill -9 <PID>
npm run dev
```

Option B: Use a different port
```bash
PORT=3001 npm run dev
```

---

### Environment Variable Missing

**Symptom:** Build or runtime errors mentioning "SITE_PASSWORD" or other env vars

**Solution:**
1. Ensure `.env.local` exists in the project root
2. Verify `SITE_PASSWORD=<value>` is set
3. Restart the dev server:
   ```bash
   npm run dev
   ```

**Note:** Environment variables are read at build/startup time. Changes to `.env.local` require a server restart.

---

### Password Doesn't Work Locally

**Symptom:** "Incorrect password" message even with correct credentials

**Solution:**
1. Check `.env.local` for the exact value:
   ```bash
   cat .env.local
   ```
2. Ensure there are no extra spaces or quotes around the password
3. Restart the dev server:
   ```bash
   npm run dev
   ```
4. Clear browser cache/sessionStorage:
   - Open DevTools (F12)
   - Go to Application → Storage → Session Storage
   - Delete the entry
   - Refresh the page

---

### Formspree Submission Doesn't Appear

**Symptom:** Feedback form shows "Submitted!" but nothing appears in Formspree dashboard

**Solution:**
1. **Verify the form ID:**
   - Check `app/api/feedback/submit/route.ts`
   - Confirm `FORMSPREE_ENDPOINT` matches your actual form ID
2. **Check Formspree dashboard:**
   - Log in at https://formspree.io/forms/meajayba/submissions
   - Look for spam/junk folder
3. **Test manually:**
   ```bash
   curl -X POST https://formspree.io/f/meajayba \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test","message":"Test submission"}'
   ```
4. **Check browser DevTools:**
   - Network tab: verify POST request to `/api/feedback/submit` returns `{"success":true}`
   - If request fails, check error details in response body

---

### Animations Don't Start

**Symptom:** Clicking "Play Assembly" does nothing; logos don't animate

**Solution:**
1. Verify you're in **Animated** display mode (not Static)
2. Check browser console for JavaScript errors (F12 → Console)
3. Ensure Framer Motion is installed:
   ```bash
   npm list framer-motion
   ```
4. Restart dev server:
   ```bash
   npm run dev
   ```

---

### Play All / Stop All Doesn't Work

**Symptom:** "Play All" button doesn't trigger animations for all concepts

**Solution:**
1. Verify you're viewing concepts (not in Static mode)
2. Check browser console for errors
3. Ensure the display mode is set to **Animated**
4. Reload the page
5. Try clicking an individual "Play Assembly" button first to verify animations work at all

---

### SVG Download Doesn't Work

**Symptom:** Clicking "↓ SVG" button does nothing or shows an error

**Solution:**
1. Open browser DevTools console (F12)
2. Look for any JavaScript errors
3. Try right-clicking the logo and selecting "Inspect"
4. Verify the SVG element is rendered:
   ```javascript
   // In browser console
   document.querySelector('svg')
   ```
5. If the SVG doesn't exist, the logo didn't render properly
6. Clear cache and restart:
   ```bash
   rm -rf .next && npm run dev
   ```

---

### Vercel Deployment Doesn't Reflect Latest Changes

**Symptom:** Live site at vercel.app still shows old version after git push

**Solution:**
1. **Wait:** Vercel builds are usually complete within 2–3 minutes
2. **Verify push succeeded:**
   ```bash
   git log -1
   ```
3. **Check Vercel dashboard:**
   - https://vercel.com/ozayn/assembly-intelligence-lab-logo
   - Look for your latest commit
   - Click it to see build status
4. **If build failed:**
   - Check logs in Vercel dashboard
   - Fix the error locally
   - Commit and push again
5. **Hard refresh the live site:**
   - Ctrl+Shift+R or Cmd+Shift+R in browser
   - Check browser cache in DevTools

---

## 12. GIT WORKFLOW REFERENCE

### Basic Commands

```bash
# See what changed
git status

# See detailed changes
git diff

# Stage specific files
git add components/logos/Concept01Convergence.tsx
git add app/page.tsx

# Commit (always include a message)
git commit -m "Fix animation timing for Concept 01"

# Push to GitHub
git push origin main

# See recent commits
git log --oneline -5
```

### Writing Good Commit Messages

Keep it short and descriptive:
- ✅ "Fix Formspree email field to use proper noreply address"
- ✅ "Implement SVG download and fix Play All/Stop All controls"
- ❌ "fix stuff"
- ❌ "update"

### Undoing Changes

```bash
# Discard changes to a file (before committing)
git checkout -- components/logos/Concept01Convergence.tsx

# Undo the last commit (keep changes)
git reset --soft HEAD~1
# Then make new changes and commit again

# View commit history
git log --oneline
```

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` with `SITE_PASSWORD=<value>`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000 and test login
- [ ] Make edits
- [ ] Test with `npm run build` + `npm run start`
- [ ] `git add`, `git commit`, `git push`
- [ ] Check Vercel dashboard for successful deployment
- [ ] Verify live site at https://assembly-intelligence-lab-logo.vercel.app

---

**Last Updated:** August 2024
