# TechCelic

**Innovation, woven with heritage.**

TechCelic is a full-stack digital studio site built as a static, multi-page website — no frameworks, no build step, just HTML, CSS, and vanilla JavaScript.

🔗 **Live site:** [tech-celic.vercel.app/](https://tech-celic.vercel.app/)

---

## About

TechCelic is a digital agency offering:

- Agentic AI Systems
- AI & Automation
- Web Development
- App Development
- Shopify Stores
- Graphic Design
- Video Editing

This repo contains the agency's marketing site — home, about, projects, and contact pages — built around the brand's interlacing star logo, with a dark navy/blue/cyan theme, animated hero art, and 3D tilt-on-hover cards.

## Pages

| Page | Description |
|---|---|
| `index.html` | Home — hero, services, process, featured work, CTA |
| `about.html` | Studio story, values, and the 9-person team grid |
| `projects.html` | Filterable portfolio across all service categories |
| `contact.html` | Contact form, studio info, and FAQ |

## Tech Stack

- **HTML5** — semantic, multi-page structure
- **CSS3** — custom properties (design tokens), CSS Grid/Flexbox, no framework
- **Vanilla JavaScript** — no dependencies, no build tools
  - Scroll-reveal animations (`IntersectionObserver`)
  - 3D tilt-on-hover cards (mouse-tracked `transform`)
  - Animated stat counters
  - Project filtering
  - Mobile nav drawer
  - Contact form handling (front-end only)

## Project Structure

```
techcelic/
├── index.html
├── about.html
├── projects.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── logo.png
```

## Running Locally

No build step or dependencies required.

**Option 1 — just open it:**
Double-click `index.html` and it opens directly in your browser.

**Option 2 — serve it locally** (recommended if you're editing, since some browsers restrict local file access):
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deployment

This site is deployed with **GitHub Pages**, served directly from the `main` branch. Any push to `main` redeploys automatically within a minute or two.

## Status

🚧 Placeholder content — copy, contact details, and project data are illustrative. The contact form is front-end only and needs a backend (e.g. Formspree, a serverless function) to actually send email.

## License

© 2026 TechCelic. All rights reserved.
