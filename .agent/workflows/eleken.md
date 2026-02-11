---
description: 
---

# 🎨 ELEKEN.CO — Design System & Workspace Rules

> **Purpose:** This file defines the complete design system rules for eleken.co. Any AI agent or developer MUST follow these rules to ensure 100% design consistency across all pages, components, and content.

---

## 1. BRAND IDENTITY

- **Brand Name:** Eleken
- **Logo:** Custom wordmark "eleken" with a superscript dot (°) — lowercase, clean sans-serif
- **Brand Personality:** Pragmatic, minimal, professional, warm, trustworthy
- **Industry:** SaaS UI/UX Design Agency

---

## 2. COLOR PALETTE

### Primary Colors
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#F5F0EB` | Page background (warm off-white/cream) |
| `--bg-secondary` | `#FFFFFF` | Cards, content blocks, image containers |
| `--text-primary` | `#1A1A1A` | Headings, primary text (near-black) |
| `--text-secondary` | `#6B6B6B` | Body text, descriptions, meta info |
| `--text-muted` | `#999999` | Captions, dates, labels like "UPDATED ON", "6 MIN TO READ" |

### Accent Colors
| Token | Hex | Usage |
|---|---|---|
| `--accent-peach` | `#F5D5B0` | Tag badges background (e.g., "ARTICLE", "SAAS BUSINESS"), highlighted links |
| `--accent-peach-text` | `#8B6914` | Tag badge text color |
| `--accent-dark` | `#1A1A1A` | Primary CTA button ("Get started") background |
| `--accent-dark-text` | `#FFFFFF` | Primary CTA button text |

### Borders & Dividers
| Token | Hex | Usage |
|---|---|---|
| `--border-light` | `#E5E0DB` | Section dividers, horizontal rules |
| `--border-circle` | `#C4C0BB` | Circle icon buttons (prev/next arrows) |

---

## 3. TYPOGRAPHY

### Font Family
- **Primary Font:** `Inter` (or system sans-serif fallback)
- **Fallback Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|
| H1 (Hero/Page Title) | `48px–56px` | `700 (Bold)` | `1.1` | `-0.02em` | None |
| H2 (Section Title) | `36px–42px` | `700 (Bold)` | `1.15` | `-0.01em` | None |
| H3 (Card Title) | `22px–26px` | `600 (Semi-bold)` | `1.3` | `0` | None |
| Body Text | `17px–18px` | `400 (Regular)` | `1.65` | `0` | None |
| Small Body | `15px–16px` | `400 (Regular)` | `1.6` | `0` | None |
| Caption/Meta | `12px–13px` | `500 (Medium)` | `1.4` | `0.08em` | `uppercase` |
| Nav Links | `15px–16px` | `500 (Medium)` | `1` | `0` | None |
| Tag Badges | `12px–13px` | `500 (Medium)` | `1` | `0.03em` | `uppercase` |

### Blockquotes (in blog articles)
- **Style:** Italic
- **Color:** `--text-secondary` (#6B6B6B)
- **Font Size:** Same as body or slightly larger
- **No border-left** — clean, minimal quote style
- **Attribution:** Regular weight, same color, below quote

---

## 4. SPACING SYSTEM

### Base Unit: `8px`
| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Inner padding small |
| `--space-md` | `16px` | Standard gap between elements |
| `--space-lg` | `24px` | Section internal padding |
| `--space-xl` | `32px` | Between content blocks |
| `--space-2xl` | `48px` | Major section gaps |
| `--space-3xl` | `64px` | Page section separation |
| `--space-4xl` | `80px–120px` | Hero top/bottom padding |

### Page Margins
- **Max content width:** `1200px`
- **Blog article content width:** `680px–720px` (narrow reading column)
- **Side padding (desktop):** `40px–80px`
- **Side padding (mobile):** `20px–24px`

---

## 5. LAYOUT & GRID

### Blog Article Layout (3-Column)
```
[Sidebar TOC]  |  [Main Content]  |  [Author Info]
   ~200px      |    ~680px        |    ~200px
```

- **Table of Contents:** Sticky left sidebar, uppercase "TABLE OF CONTENTS" label with dash separator
- **TOC Links:** Regular weight, dark text, separated by thin borders
- **Author Card:** Right sidebar with photo, name (bold), bio text, LinkedIn icon
- **Main Content:** Centered, optimal reading width

### Homepage Layout
- **Full-width sections** with content constrained to max-width
- **Card grid:** 3–4 columns on desktop for blog post cards
- **Horizontal scrolling carousel** for case studies and blog posts

### Footer Layout
- **4-column grid:** Company info | Services | Approach/Company | SaaS Niches
- **Background:** Same as page (`--bg-primary`)
- **Links:** Regular weight, dark text, no underline

---

## 6. COMPONENTS

### Navigation Bar
- **Position:** Fixed/sticky top
- **Background:** `--bg-primary` (transparent/cream)
- **Height:** `64px–72px`
- **Logo:** Left-aligned
- **Links:** Center-aligned, `--text-primary`, 500 weight
- **CTA Button:** Right-aligned, dark rounded pill button
- **Mobile:** Hamburger menu icon

### Primary Button ("Get started")
- **Background:** `#1A1A1A` (near-black)
- **Text:** `#FFFFFF`, 500 weight, `14px–15px`
- **Padding:** `12px 24px`
- **Border Radius:** `100px` (full pill shape)
- **Hover:** Slight opacity change or subtle scale

### Secondary/Text Links
- **Style:** Text + right arrow icon (→)
- **Color:** `--text-primary`
- **Hover:** Underline or arrow moves right

### Tag Badges
- **Background:** `--accent-peach` (#F5D5B0)
- **Text:** Uppercase, `12px`, 500 weight
- **Padding:** `4px 12px`
- **Border Radius:** `4px`
- **Border:** `1px solid rgba(0,0,0,0.08)`

### Circle Navigation Arrows (Prev/Next)
- **Size:** `44px–48px` diameter
- **Border:** `1.5px solid --border-circle`
- **Background:** Transparent
- **Icon:** Thin arrow (←/→), dark color
- **Hover:** Background fills slightly

### Blog Post Cards
- **Background:** `--bg-primary` (no card background — flat design)
- **Image:** Full-width illustration, line-art style, contained in card area
- **Tag + Date:** Row below image, left-aligned tag badge + right-aligned date
- **Title:** Bold, `22px–26px`, 2–3 lines max
- **Description:** Regular weight, `--text-secondary`, 2–3 lines
- **No border/shadow** — clean, borderless cards

### Social Share Icons
- **Style:** Circle outlines (Facebook, Twitter/X, LinkedIn)
- **Size:** `40px` diameter
- **Color:** `--border-circle` border, dark icon
- **Hover:** Fill or darken

---

## 7. IMAGERY & ILLUSTRATION STYLE

### Blog/Article Illustrations
- **Style:** Minimalist line-art / outline illustrations
- **Color:** Monochrome black on white/cream background
- **Stroke:** Thin, consistent 1.5px–2px strokes
- **Content:** UI wireframes, abstract product sketches, user journey diagrams
- **No gradients, no heavy fills** — pure line work

### Case Study Images
- **Style:** Full-color product screenshots or mockups
- **Presentation:** Clean, minimal framing
- **Background:** White or light container

### Diagrams (in articles)
- **Style:** Simple, clean with points A→B, flow arrows
- **Color:** Black on white
- **Contained in:** Light gray/white box with subtle border

---

## 8. BLOG ARTICLE PAGE RULES

### Hero Section
- Tags (badges) at top-left
- "UPDATED ON: [DATE]" at top-right, muted uppercase
- H1 title: Large, bold, max 2–3 lines
- "X MIN TO READ" below title, muted uppercase
- Hero illustration centered below

### Content Section
- Clean paragraphs with generous line-height (1.65)
- Subheadings (H2): Bold, large, clear hierarchy
- Numbered lists for structured content
- Blockquotes: Italic, gray, with author attribution below
- Highlighted internal links: Peach/gold background highlight on link text
- Embedded YouTube videos: Full-width within content column

### Bottom Section
- Share section: "SHARE" label + social circle icons
- Thin horizontal divider
- "Explore our blog posts" section with card carousel
- Navigation arrows (circle buttons) for carousel

---

## 9. FOOTER RULES

- **Layout:** 4-column grid
- **Column 1:** Logo + office addresses (Kyiv, Ukraine & Newark, DE)
- **Column 2:** Services links (Design from scratch, Product redesign, Team extension)
- **Column 3:** Approach links + Company links
- **Column 4:** SaaS Niches links + Comparison links + Stories links
- **Section labels:** Muted gray, small uppercase text
- **Link style:** Regular weight, dark text, no underline, generous vertical spacing

---

## 10. RESPONSIVE BEHAVIOR

### Breakpoints
| Breakpoint | Value |
|---|---|
| Mobile | `< 768px` |
| Tablet | `768px – 1024px` |
| Desktop | `> 1024px` |
| Large Desktop | `> 1440px` |

### Mobile Adaptations
- Hamburger menu replaces nav links
- Single column layout for all content
- Blog sidebar (TOC + Author) collapses above/below content
- Cards stack vertically
- Footer columns stack to 1–2 columns
- Font sizes reduce by ~15–20%
- Spacing reduces proportionally

---

## 11. ANIMATION & INTERACTION

- **Transitions:** Smooth, subtle (`0.2s–0.3s ease`)
- **Hover effects:** Opacity changes, subtle scale, underline reveals
- **Scroll animations:** Minimal — content fades in gently
- **No flashy animations** — everything should feel calm and professional
- **Carousel:** Horizontal scroll with arrow navigation, no auto-play

---

## 12. DO's AND DON'Ts

### ✅ DO
- Use generous whitespace — let content breathe
- Keep hierarchy clear with type scale alone (not color or decoration)
- Use warm cream background (`#F5F0EB`) everywhere as base
- Keep illustrations minimal, monochrome line-art style
- Use peach/gold accent sparingly — only for tags and link highlights
- Maintain narrow reading width for articles (~680px)
- Use uppercase sparingly — only for labels, tags, meta text

### ❌ DON'T
- Don't use bright/saturated colors anywhere
- Don't use heavy box shadows or borders on cards
- Don't use rounded corners larger than 8px (except pill buttons)
- Don't use more than 2 font weights on a single component
- Don't use gradient backgrounds
- Don't use decorative fonts — stick to Inter/system sans-serif
- Don't crowd elements — minimum 16px gap between any two elements
- Don't use emoji in content (except in informal contexts)
- Don't auto-play videos or carousels

---

## 13. CODE CONVENTIONS (for developers)

```css
/* Example CSS Variables */
:root {
  --bg-primary: #F5F0EB;
  --bg-secondary: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --text-muted: #999999;
  --accent-peach: #F5D5B0;
  --border-light: #E5E0DB;
  --border-circle: #C4C0BB;
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 100px;
  --transition: 0.25s ease;
  --max-width: 1200px;
  --article-width: 700px;
}
```

---

> **⚠️ IMPORTANT:** Every new page, component, or design created for this project MUST reference this file and follow all rules exactly. Deviations are not allowed without explicit approval.