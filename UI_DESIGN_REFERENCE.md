# Crelands UI Design Reference

Use this file as the source of truth when redesigning Crelands pages so new work stays consistent with the current marketplace UI.

## Design Direction

Crelands should feel like a clean creator marketplace and seller workspace: calm, modern, rounded, trustworthy, and practical. The UI should be polished without feeling heavy or overly decorative. Buyer-facing pages can be a little more editorial, while dashboard/account pages should stay compact and task-focused.

The current design language uses:

- Rounded surfaces with soft borders and light shadows.
- White cards and panels over subtle warm-to-cool gradients.
- Slate text hierarchy with `primary-brand` / red-orange accents.
- Compact dashboard headers instead of oversized marketing sections.
- Responsive card/list hybrids that become structured table-like rows on desktop.

## Color System

Primary surfaces:

- Main background: white or very light neutral.
- Section gradient: `bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)]`
- Card background: `bg-white`
- Soft input background: `bg-slate-50`

Borders and shadows:

- Standard border: `border border-slate-200`
- Dashed empty states: `border border-dashed border-slate-300`
- Light panel shadow: `shadow-[0_16px_40px_rgba(15,23,42,0.05)]`
- Smaller card shadow: `shadow-[0_14px_35px_rgba(15,23,42,0.04)]`

Text:

- Primary: `text-slate-950`
- Secondary: `text-slate-600`
- Muted: `text-slate-500`
- Accent: `text-primary-brand`, `text-orange-700`

Accent badges:

- `border border-orange-200 bg-orange-50 text-orange-700`
- Use for product categories, listing states, and section labels.

Avoid making pages look mostly beige, orange, or slate. Use the gradient sparingly for page headers, and keep operational content mostly white.

## Typography

Use compact, readable typography. Avoid oversized headings inside dashboards and forms.

Page headers:

- `text-3xl sm:text-4xl`
- `font-semibold`
- `tracking-[-0.04em]` is currently used in the app, but do not make tracking more aggressive.

Panel titles:

- `text-xl` or `text-2xl`
- `font-semibold`

Body copy:

- `text-base leading-7 text-slate-600`
- Smaller helper text: `text-sm leading-6 text-slate-600`

Labels:

- `text-sm font-semibold text-slate-700`

Eyebrows:

- `text-sm font-semibold uppercase tracking-[0.18em] text-slate-500`

## Page Structure

Most redesigned pages follow this structure:

1. Optional breadcrumbs or navigation context.
2. Compact page header section.
3. Main content panel/list/form.
4. Sticky summary or preview panel when useful.

Standard page header:

```jsx
<section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
  <div className="max-w-2xl">
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
      <Icon className="h-4 w-4" />
      Section Label
    </div>
    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
      Page Title
    </h1>
    <p className="mt-3 text-base leading-7 text-slate-600">
      Short, direct explanation of what this page is for.
    </p>
  </div>
</section>
```

Keep dashboard/account headers concise. Do not add extra feature cards beside the header unless they serve a real workflow.

## Layout Rules

Global page wrapper:

- Use `global-padding`.
- Use `space-y-6` between major sections.
- Use `pb-10` for dashboard/account/cart pages.

Dashboard/account shell:

```jsx
<div className="global-padding grid min-h-screen gap-4 pb-10 sm:gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
  <aside className="min-w-0">
    <Sidebar tabs={tabs} />
  </aside>
  <main className="min-w-0">{children}</main>
</div>
```

Use a sticky sidebar on desktop and horizontal scroll nav on mobile.

## Sidebar Pattern

Sidebar should be a rounded white panel:

- Wrapper: `rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.05)]`
- Desktop: `lg:sticky lg:top-24 lg:p-4`
- Nav: `flex gap-2 overflow-x-auto no-scrollbar lg:flex-col`
- Active tab: warm light gradient, `text-slate-950`, `ring-1 ring-orange-100`
- Inactive tab: `text-slate-600 hover:bg-slate-50 hover:text-slate-950`
- Use lucide icons in a small rounded icon tile.

## Buttons

Primary CTA:

```jsx
className="h-12 rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand"
```

Secondary button:

```jsx
className="h-12 rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
```

Icon button:

```jsx
className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950"
```

Destructive icon button:

```jsx
className="h-10 w-10 rounded-full border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
```

Always include lucide icons for clear actions when appropriate.

## Forms

Forms should be grouped into clear sections, not a flat list of inputs.

Form panel:

```jsx
className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6"
```

Field group:

```jsx
className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-6"
```

Inputs:

```jsx
className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base shadow-none"
```

Textareas:

```jsx
className="min-h-36 rounded-[1.25rem] border-slate-200 bg-slate-50 px-4 py-3 text-base shadow-none"
```

Labels:

```jsx
className="text-sm font-semibold text-slate-700"
```

Descriptions:

```jsx
className="text-sm text-slate-500"
```

## Upload Fields

Use custom upload panels instead of the browser default file input.

Pattern:

- Hide the actual `<input type="file" />`.
- Use a dashed outer panel: `rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4`
- Use an inner clickable panel: `rounded-[1rem] border border-slate-200 bg-white p-4 hover:bg-slate-50`
- Add a dark rounded upload button inside the label.
- Show file summary text in a small `bg-slate-50` pill/panel.

Upload button:

```jsx
className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white"
```

Preview panels should be rounded, bordered, and have a clear empty state.

## Lists And Tables

Use responsive list rows instead of raw tables for dashboard/account/cart pages.

Desktop list container:

```jsx
className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
```

Desktop header row:

```jsx
className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid"
```

Rows:

```jsx
className="grid gap-4 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:px-5 lg:items-center"
```

Use mobile labels inside rows:

```jsx
<span className="text-sm font-medium text-slate-500 lg:hidden">Label</span>
```

Use `divide-y divide-slate-200` between rows.

## Empty States

Use a centered dashed panel with icon, title, and short copy.

```jsx
<div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
    <Icon className="h-6 w-6" />
  </div>
  <h2 className="text-xl font-semibold text-slate-950">Empty state title</h2>
  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
    Short explanation.
  </p>
</div>
```

## Dropdown Action Menus

Use a rounded icon trigger with `EllipsisVertical`.

Trigger:

```jsx
<Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950">
  <EllipsisVertical className="h-4 w-4" />
</Button>
```

Menu:

```jsx
className="w-44 rounded-2xl border-slate-200 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
```

Items:

- Use icons like `Eye`, `Pencil`, `Download`, `Trash2`.
- Destructive items use red text and `focus:bg-red-50`.
- Do not change routes or action handlers when only redesigning UI.

## Dialogs

Use rounded modals with stronger title hierarchy.

```jsx
<DialogContent className="rounded-[1.75rem] border-slate-200 p-6 sm:max-w-md">
```

Title:

```jsx
className="text-xl font-semibold text-slate-950"
```

Description:

```jsx
className="leading-6 text-slate-600"
```

Buttons should use the same primary/secondary/destructive patterns as normal page buttons.

## Cart Pattern

Cart pages should use:

- Compact cart header with checkout CTA.
- Responsive cart item rows.
- Sticky summary panel on desktop: `lg:sticky lg:top-24`.
- Empty state with `PackageOpen`.

Summary card:

```jsx
className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
```

## Product Detail Pattern

Product detail pages should use:

- Gradient detail shell.
- Breadcrumbs at top.
- Product image gallery on left.
- Product info, price, short description, and purchase controls on right.
- On mobile, purchase controls appear immediately after short description.
- Secondary benefit cards and seller info follow purchase controls.
- Description and reviews use separate rounded white sections.

## Seller Dashboard Pattern

Seller dashboard pages should use:

- Shared sidebar shell.
- Compact page header.
- Responsive row lists for products/orders.
- Modern form panels for profile/payment/product settings.
- Sticky preview/summary panels when useful.

Avoid marketing-style hero sections inside dashboard pages. The dashboard is an operational workspace.

## Buyer Account Pattern

Buyer account pages should use:

- Same sidebar shell as seller dashboard.
- Compact page headers.
- Grouped profile form sections.
- Responsive order list with actions menu.
- Empty states for no orders.

## Mobile Rules

- Reduce spacing between sidebar and content: dashboard/account shell uses `gap-4 sm:gap-5 lg:gap-8`.
- Headers use `p-4` on mobile and `sm:p-6 lg:p-7` later.
- Lists become stacked rows with inline labels.
- Buttons are full width on mobile when they are primary page actions.
- Avoid text overflow by using `line-clamp`, `min-w-0`, and sensible max widths.
- Avoid oversized heading text on mobile dashboards.

## Copy Guidelines

Keep copy direct and useful:

- Explain what the user can do on the page.
- Avoid long marketing claims in dashboards.
- Use buyer/seller language based on page context.
- Use concrete labels like "Products", "Orders", "Payment Details", "Profile", "Your Cart".

## Common Icons

Use lucide-react:

- Dashboard: `LayoutDashboard`
- Products: `Package2`
- Orders: `ShoppingBag`, `ReceiptText`, `ClipboardList`
- Payment: `Wallet`, `Landmark`, `ShieldCheck`
- Profile: `UserRound`
- Cart: `ShoppingCart`
- Actions: `EllipsisVertical`, `Eye`, `Pencil`, `Trash2`, `Download`
- Empty state: `PackageOpen`
- Upload: `Upload`, `ImagePlus`, `FileUp`

## Things To Avoid

- Raw tables for responsive dashboard lists.
- Default browser file inputs.
- Large marketing cards inside forms and dashboards.
- Multiple nested cards inside cards.
- Excessive vertical gaps on mobile.
- Old button style with square corners or default `Button` sizing.
- Changing behavior while doing a UI-only redesign.

