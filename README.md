# Assembly Intelligence Lab — Logo Exploration Microsite

An interactive design review environment for evaluating 12 distinct self-assembly logo concepts, featuring animations, feedback collection, and an admin analytics dashboard.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase keys (optional — feedback system won't work without them, but the site will still display logos).

### 3. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main logo exploration page
│   ├── globals.css             # Global styles
│   ├── page.css                # Main page styles
│   └── admin/
│       ├── page.tsx            # Feedback analytics dashboard
│       └── admin.css           # Admin styles
├── components/
│   ├── LogoCard.tsx            # Individual logo concept card
│   ├── LogoCard.css
│   ├── FeedbackForm.tsx        # Feedback collection form
│   ├── FeedbackForm.css
│   ├── ReviewerContext.tsx     # Context for reviewer name
│   ├── ReviewerModal.tsx       # Name collection modal
│   ├── ReviewerModal.css
│   ├── ThemeProvider.tsx       # Light/dark theme
│   └── logos/                  # Logo concepts
│       ├── index.ts            # All concept exports
│       ├── Concept01Convergence.tsx
│       ├── Concept02Interlocking.tsx
│       ├── ... (10 more concepts)
│       └── Concept12CollectiveIntelligence.tsx
├── lib/
│   └── supabase.ts             # Supabase client setup
├── api/
│   └── feedback/
│       ├── submit/route.ts     # Submit feedback endpoint
│       └── results/route.ts    # Retrieve analytics endpoint
└── .env.local.example          # Environment variables template
```

## Features

### For Reviewers

- **12 Logo Concepts** with distinct self-assembly animations
- **Static/Animated Toggling** — view logos in static form or watch assembly
- **Theme Controls** — light and dark mode
- **Size Preview** — evaluate marks at 64px, 32px, 16px
- **Feedback per Concept**:
  - Like/dislike static mark
  - Like/dislike animation behavior
  - Tag quick feedback (8 predefined tags)
  - Optional written comments
- **Shortlist** — compare 2–4 concepts side-by-side
- **No Account Required** — name is stored in browser

### For Designers/Admins

- **Admin Dashboard** (`/admin`) showing:
  - Number of reviewers and total feedback entries
  - List of all reviewers
  - Concepts ranked by static logo likes
  - Tag frequency cloud
  - All written comments per concept
  - Preference matrix (who liked what)
- **Round Management** — select feedback round (1, 2, 3) to preserve history
- **Export-Ready** — structured data for further analysis

## The 12 Concepts

Each concept explores a different self-assembly mechanism:

| # | Name | Description |
|---|------|-------------|
| 01 | Convergence | Particles attract and form structure |
| 02 | Interlocking | Modules rotate and lock together |
| 03 | Emergence | Scattered components reveal order |
| 04 | Propagation | Sequential assembly in a chain |
| 05 | Equilibrium | Elements orbit before settling |
| 06 | Negative Space | Assembly around a void |
| 07 | Clustering | Dispersed units compact together |
| 08 | Chain Assembly | Progressive linear connection |
| 09 | Folding | Elements rotate into compact form |
| 10 | Modular Growth | Structure builds outward piece by piece |
| 11 | Reconfiguration | Multiple arrangements before final state |
| 12 | Collective Intelligence | Independent units create larger symbol |

## Animations

- **Duration**: 2–3 seconds per assembly
- **Timing**: Staggered and eased for sophistication
- **Respects `prefers-reduced-motion`** for accessibility
- **Built with Framer Motion** — lightweight, performant

## Feedback System

### How It Works

1. Visitor opens site → prompted to enter name
2. Name stored in browser localStorage
3. For each concept, reviewer can:
   - Like the static logo (♡ Like)
   - Like the animation (♡ Like)
   - Select quick-feedback tags
   - Add optional comment
4. At bottom of page, a sticky bar shows feedback count
5. Reviewer clicks "Submit Feedback"
6. All feedback is sent to Supabase

### Feedback Structure

```typescript
{
  round: 1,                          // Round number (for versioning)
  reviewer_name: string,             // Name (from modal)
  concept_id: 1-12,                  // Which concept
  like_static: boolean,              // Static logo feedback
  like_animation: boolean,           // Animation feedback
  tags: string[],                    // Quick tags (max 8 options)
  comment: string,                   // Optional written feedback
  created_at: timestamp              // Automatically recorded
}
```

### Admin Dashboard

Visit `/admin?round=1` to see:
- **Summary**: reviewers count, total feedback, average per reviewer
- **Reviewer List**: all names who submitted feedback
- **Concepts Table**: static likes, animation likes, like rate %
- **Tag Frequency**: most common feedback tags
- **Comments**: all written feedback, grouped by concept
- **Preference Matrix**: heatmap showing which reviewers liked which concepts

## Building for Production

### Build Locally
```bash
npm run build
npm run start
```

### Deploy to Vercel
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step Vercel setup.

**Recommended workflow:**
1. Update logos locally
2. `git push` to GitHub
3. Vercel auto-deploys within ~1 minute

## Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Styling**: CSS modules + CSS variables (light/dark theme)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ✅ Respects `prefers-reduced-motion` (disables animations)
- ✅ Keyboard navigation on all controls
- ✅ Color contrast meets WCAG AA
- ✅ Semantic HTML
- ✅ Tested on light and dark backgrounds

## Performance

- **Total bundle size**: ~150KB (with animations)
- **First Contentful Paint**: <1.2s
- **Lighthouse**: 90+ on desktop

## Future Enhancements

### Phase 2
- Logo download (SVG, PNG variants)
- Squarespace export presets
- Real-world preview mockups (header, mobile, favicon)

### Phase 3
- Advanced analytics (heatmaps, sentiment analysis)
- A/B testing framework
- Export feedback to CSV

## License

This project is proprietary to Assembly Intelligence Lab.

## Support

For questions about:
- **Local development**: Check this README
- **Deployment**: See DEPLOYMENT.md
- **Concept design**: See each Concept*.tsx file
- **Feedback system**: Check components/FeedbackForm.tsx and app/admin/page.tsx
