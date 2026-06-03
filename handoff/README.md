# Handoff: KulukorvausForm Redesign

## Overview

This is a high-fidelity redesign of `src/KulukorvausForm.js` — the Kaplaaki ry expense reimbursement form. The prototype was built to explore **three visual directions** and add **bilingual (FI/EN) support**. Your task is to take the chosen direction and update `KulukorvausForm.js` (and related files) to match, preserving all existing PDF-generation and EmailJS logic.

---

## About the Design Files

The files in this bundle are **HTML/JSX design references** — interactive prototypes showing intended look, layout, and behavior. Do **not** ship them directly. Instead, recreate the designs inside the existing Create React App codebase, keeping `generatePDF.js`, EmailJS sending, and any other business logic intact.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, border radii, shadows, and all interaction states are final and should be matched precisely.

---

## Three Visual Directions (pick one)

All three are switchable in the prototype via the Tweaks panel (bottom-right corner). Choose one direction and apply its token set.

### 1. Classic Navy _(closest to today's look)_
| Token | Value |
|---|---|
| Primary / header bg | `#001F3F` |
| Page bg | `#F5F5F0` |
| Card bg | `#FFFFFF`, border `#E8E8E8` |
| Body font | Roboto Slab, serif |
| Heading font | Roboto Slab, serif |
| Border radius (inputs) | `8px` |
| Border radius (cards) | `10px` |
| Accent light | `#EEF4FF` |
| Accent border | `#C5D8F6` |
| Error text | `#DC2626` |
| Checkbox active | `#22C55E` |

### 2. Nordic Minimal
| Token | Value |
|---|---|
| Primary | `#4F46E5` (indigo) |
| Page bg | `#F8F9FC` |
| Card bg | `#FFFFFF`, border `#E2E8F0`, shadow `0 1px 3px rgba(15,23,42,0.06)` |
| Body font | DM Sans, sans-serif |
| Heading font | DM Sans, sans-serif |
| Border radius (inputs) | `6px` |
| Border radius (cards) | `12px` |
| Header bg | `#FFFFFF` (light header — no invert on logo) |
| Accent light | `#EEF2FF` |
| Error text | `#E11D48` |
| Checkbox active | `#4F46E5` |

### 3. Guild Heritage
| Token | Value |
|---|---|
| Primary | `#1B3A2D` (forest green) |
| Accent (highlights) | `#C5922E` (warm gold) |
| Page bg | `#FAF7F0` |
| Card bg | `#FEFDF9`, border `#E5DFD5` |
| Body font | Source Sans 3, sans-serif |
| Heading font | Playfair Display, serif |
| Border radius (inputs) | `4px` |
| Border radius (cards) | `8px` |
| Accent light | `#FDF6E3` |
| Error text | `#C0392B` |
| Checkbox active | `#C5922E` |

---

## Screens / Views

### 1. Header

**Dark-header themes (Classic Navy, Guild Heritage):**
- Full-width bar, `padding: 18px 28px`, `display: flex`, `align-items: center`
- Logo: 120×120px white circle (`border-radius: 50%`, `overflow: hidden`, `box-shadow: 0 0 0 2px rgba(255,255,255,0.25)`, `margin: -8px 0`), logo image fills it without filter
- Immediately to the right of the circle (`margin-left: 16px`): org name + subtitle stacked
  - Org name: `font-size: 18px`, `font-weight: 700`, heading font, `letter-spacing: 0.02em`, white
  - Subtitle: `font-size: 11px`, `opacity: 0.65`, `letter-spacing: 0.07em`, `text-transform: uppercase`
- FI/EN toggle pushed to far right via `flex: 1` spacer

**Light-header theme (Nordic Minimal):**
- White bar, `border-bottom: 1px solid #E2E8F0`, `padding: 14px 28px`
- Logo: 64×64px `<img>` directly (no circle), logo is dark so no filter needed
- Title + subtitle to the right (`flex: 1`)
- FI/EN toggle on far right

**FI/EN Language Toggle:**
- Pill shape: `border-radius: 20px`, `overflow: hidden`
- Two `<button>` children side by side — no gap
- Dark header: border `1px solid rgba(255,255,255,0.25)`; active pill bg `rgba(255,255,255,0.22)`, active text `#fff`, inactive text `rgba(255,255,255,0.5)`
- Light header: border = `inputBorder` color; active pill bg = primary color, inactive bg transparent
- Button padding `5px 11px`, `font-size: 12px`, `font-weight: 600`, `letter-spacing: 0.03em`
- On click: toggle `language` state between `"fi"` and `"en"`; all labels in the form re-render via the i18n map

---

### 2. Form Type Selector (Normaali / ESTIEM)

- White card (`padding: 10px 12px`), two equal-width pill buttons side by side (`gap: 8px`)
- Active: primary bg, white text. Inactive: `#F0F0F0` bg, `#666` text
- `font-size: 13px`, `font-weight: 600`, `padding: 9px 16px`
- Switching to ESTIEM shows an info banner below and changes checklist items

---

### 3. Applicant Card

Section title: `font-size: 13px`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.06em`, primary color, heading font, `margin-bottom: 18px`

Fields (top → bottom):
1. **Nimi** — full width
2. **Puhelin + Sähköposti** — 2-column grid (`1fr 1fr`, `gap: 12px`)
3. **Pankki/BIC + IBAN** — 2-column grid (`140px 1fr`, `gap: 12px`)

**Field label style:** `font-size: 11px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.03em`, muted color, `margin-bottom: 5px`

**Input style:**
- `padding: 9px 12px`, `font-size: 14px`, `border-radius` = theme token
- Normal: `background: inputBg`, `border: inputBorderWidth solid inputBorder`
- Error (after submit): `background: errorBg`, border color = `errorText + "88"`
- IBAN: format on change as groups of 4 (FI21 1234 5600 0007 85). Show inline error below if invalid format.
- Phone: auto-format on change (Finnish: 045 → "045 XXX XXXX")

---

### 4. Itemization Card

- Section title inline with an event-name input (stretches to fill remaining width in a flex row)
- **ESTIEM only:** event-type chip row (Akateeminen / Muu / Edustomatto) — outlined chips, active chip gets accentLight bg + accentBorder + accentText color
- Column headers: DATE / SELITYS / SUMMA (€) in a `grid-template-columns: 100px 1fr 90px 28px` grid, `font-size: 11px`, textLight color
- Each expense row: same 4-column grid, inputs `padding: 7px 10px`, `font-size: 13px`; last column is an × remove button (hidden/dimmed when only 1 row)
- "+ Lisää rivi" button: full width, `border: 1px dashed inputBorder`, no background, `font-size: 12px`, muted color
- **Subtotal** (shows when total > 0): right-aligned, accentLight pill badge with tabular-nums
- **Km compensation toggle:** dashed separator above, then a `<Checkbox>` — when checked, reveals:
  - From/To 2-col grid
  - Purpose full width
  - km / L/100km / €/L 3-col grid
  - Live calculation display: accentLight box showing formula and computed total in primary color, `font-size: 16px`, `font-weight: 700`
- **Grand total:** 2px solid primary border-top, right-aligned, accentLight + accentBorder box, `font-size: 18px`, primary color

---

### 5. Attachments Card

- **Attachment description** text input (required)
- **File drop zone:** dashed border label, upload icon SVG, file-picker `<input type="file" multiple accept="image/*,.pdf">` hidden inside. Shows selected file list with × per file.
- **Checklist** in a light-bg sub-panel:
  - Always: kuitit-checkbox
  - If km: tankkaus-checkbox
  - If ESTIEM: kompensaatio-checkbox + todistus-checkbox
  - Custom checkbox: 18×18px rounded square, active fill = `checkboxColor` token with white check SVG

---

### 6. Signature Card

2-column grid (`1fr 1fr`):
- Left: place input + date input side by side (`1fr 108px` inner grid)
- Right: signature (initials) input

---

### 7. Validation & Submit

- On submit: run all validations, show error list in a red-bg / red-border panel above the button
- Error panel: `font-size: 13px` heading, `font-size: 12px` bullet list items, each prefixed with `·`
- Submit button: full width, `padding: 14px 24px`, `font-size: 15px`, `font-weight: 700`, primary bg, white text; `"not-allowed"` cursor + lighter bg when generating

---

### 8. Success Screen

Replaces the whole form:
- Centered vertically + horizontally, `max-width: 480px`
- Success circle: `64px` diameter, `#22C55E` bg, white checkmark SVG
- Heading `font-size: 22px`, then body copy with email address bolded
- Summary card in accentLight showing total EUR and applicant name
- "← Takaisin lomakkeelle" ghost button

---

## Interactions & Behavior

| Action | Result |
|---|---|
| Click FI/EN toggle | All labels, placeholders, error strings, section titles switch language instantly |
| Type IBAN | Auto-format to `XX## #### #### #### ##` groups |
| Type phone (Finnish) | Auto-format to `045 123 4567` or `+358 45 123 4567` |
| Toggle Km checkbox | Km sub-section animates open; km compensation computed live |
| Switch ESTIEM type | Info banner text updates; reimbursement rate changes |
| Click submit with errors | Inline field error highlights (red bg + border) + summary error list at bottom |
| Click submit (valid) | 1.2 s mock generating state → success screen |
| Click "Takaisin" | Return to form, reset submitted state |

---

## Bilingual i18n

All user-facing strings are stored in an `i18n` map (see `i18n.js`). Implement this in the existing codebase as a `const LABELS = { fi: {...}, en: {...} }` object and pass `LABELS[language]` through the component tree (or via context). The full string map is in `i18n.js`.

Key strings to wire up:
- Section titles, field labels, placeholders
- Error messages (some are functions: `errRowDate: (i) => `Rivi ${i}: ...``)
- Submit button states
- Success screen copy
- ESTIEM info banner (function: `estiemInfo(rate, maxTravel, maxPartic)`)

---

## State Variables to Add / Change

| Variable | Type | Notes |
|---|---|---|
| `language` | `"fi" \| "en"` | New — drives all labels |
| `formType` | `"normal" \| "estiem"` | Already exists — keep |
| `estiemEventType` | `"academic" \| "other" \| "representation"` | New — affects reimbursement rate |
| `includeKm` | boolean | May already exist as `showKmSection` |
| `kmFuelReceiptAttached` | boolean | New checkbox state |
| `hasCompensation` | boolean | New (ESTIEM only) |
| `hasCertificate` | boolean | New (ESTIEM only) |
| `attachedFiles` | `File[]` | Keep existing file-attach logic |

---

## Validation Rules (update existing `validate()`)

| Field | Rule |
|---|---|
| Name | Non-empty |
| Phone | `/^[\d\s+\-()]{7,20}$/` |
| Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| IBAN | Must match Finnish FI## #### pattern or generic `[A-Z]{2}\d{2}[A-Z0-9]{4,30}` |
| Expense rows | Each filled row must have date, description, amount > 0 |
| At least one row OR km toggle | Required |
| Km fields | All required if toggle on; distance ≥ 1 km |
| Attachment description | Non-empty |
| Place | Non-empty |
| Signature | Non-empty |
| ESTIEM: event name | Non-empty |
| ESTIEM: compensation + cert checkboxes | Both required |

---

## Design Tokens (Classic Navy — recommended starting point)

```js
const THEME = {
  primary:       "#001F3F",
  pageBg:        "#F5F5F0",
  cardBg:        "#FFFFFF",
  cardBorder:    "#E8E8E8",
  text:          "#1A1A1A",
  textMuted:     "#666666",
  textLight:     "#999999",
  labelColor:    "#555555",
  inputBg:       "#FAFAFA",
  inputBorder:   "#DDDDDD",
  accentLight:   "#EEF4FF",
  accentBorder:  "#C5D8F6",
  errorBg:       "#FEF2F2",
  errorBorder:   "#FECACA",
  errorText:     "#DC2626",
  checkboxColor: "#22C55E",
  headerBg:      "#001F3F",
  headerText:    "#FFFFFF",
  borderRadius:  "8px",
  cardRadius:    "10px",
  bodyFont:      "'Roboto Slab', serif",
  headingFont:   "'Roboto Slab', serif",
};
```

---

## Assets

- **`kaplaaki-logo.png`** — official Kaplaaki seal logo (2728px, transparent background, black artwork). Place in `public/` and reference as `/kaplaaki-logo.png`.  
  - On dark headers: display inside a 120×120px white circle (`border-radius: 50%`, `overflow: hidden`).  
  - On light headers: display directly at 64×64px.

---

## Files in This Bundle

| File | Purpose |
|---|---|
| `Kaplaaki Expense Form.html` | Live interactive prototype — open in browser to review all three themes |
| `KaplaakiForm.jsx` | Main form component (design reference) |
| `FormComponents.jsx` | Shared UI primitives (SectionCard, InputEl, Checkbox, etc.) |
| `themes.js` | Full token sets for all three visual directions |
| `i18n.js` | Complete Finnish + English string map |
| `validators.js` | IBAN, email, phone validation + formatting helpers |
| `kaplaaki-logo.png` | Official logo asset |

---

## What to Keep Unchanged

- `generatePDF.js` — PDF generation logic, data mapping, layout
- EmailJS integration in `KulukorvausForm.js`
- All existing form field names / state that PDF generation depends on
- `public/index.html` boilerplate

---

## Suggested Implementation Order

1. Add `language` state + i18n map; wire FI/EN toggle to header
2. Apply chosen theme tokens as CSS variables or a `THEME` const
3. Restyle header (logo circle, title placement, toggle)
4. Restyle form type selector pill
5. Restyle applicant card fields + labels
6. Restyle itemization table + km section
7. Restyle attachments + checklist
8. Restyle signature card
9. Update validation function (add new rules, new fields)
10. Add ESTIEM event type chips + bilingual ESTIEM banner
11. Style error panel + success screen
12. QA against the prototype in all three themes
