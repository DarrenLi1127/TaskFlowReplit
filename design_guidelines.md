# Design Guidelines: Minimal Task Management Application

## Design Approach
**Selected Approach:** Design System-Based (Productivity Focus)  
**Primary Reference:** Linear's minimal productivity aesthetic combined with Material Design patterns for form interactions  
**Rationale:** Task management requires clarity, efficiency, and learnability over visual spectacle. Users need to quickly create, scan, and manage tasks without cognitive overhead.

## Core Design Principles
1. **Scannable hierarchy** - Tasks should be immediately distinguishable by state
2. **Minimal friction** - Quick task creation and editing with minimal clicks
3. **Breathing room** - Generous spacing prevents visual clutter in task-dense views
4. **Contextual actions** - Show controls only when needed (hover states, contextual menus)

---

## Typography System

**Font Family:** Inter (Google Fonts) for interface clarity
- **Primary:** Inter (weights: 400, 500, 600)
- **Monospace:** JetBrains Mono for task IDs or timestamps

**Type Scale:**
- **Page Title:** text-2xl (24px), font-semibold (600)
- **Section Headers:** text-lg (18px), font-medium (500)
- **Task Title:** text-base (16px), font-medium (500)
- **Task Description:** text-sm (14px), font-normal (400)
- **Metadata/Labels:** text-xs (12px), font-medium (500), uppercase tracking-wide
- **Buttons:** text-sm (14px), font-medium (500)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 for consistency
- **Component padding:** p-4, p-6
- **Section gaps:** gap-4, gap-6
- **List item spacing:** space-y-2, space-y-3
- **Page margins:** px-6, py-8

**Container Strategy:**
- **Max width:** max-w-4xl for primary content area (optimized for reading tasks)
- **Centered layout:** mx-auto for main container
- **Full-height:** min-h-screen for app wrapper

**Grid System:**
- Single column for task list (max-w-4xl)
- Two-column for task detail view: 2/3 main content, 1/3 metadata sidebar on desktop
- Responsive collapse to single column on mobile (< md breakpoint)

---

## Component Library

### 1. Authentication Views
**Login/Register Page:**
- Centered card (max-w-md) with generous padding (p-8)
- Logo/app name at top (mb-8)
- Form fields stacked vertically (space-y-4)
- Primary action button full-width
- Replit Auth button with icon (Heroicons user-circle)
- Toggle between login/register with text link (text-sm)

### 2. Application Shell
**Top Navigation Bar:**
- Fixed header (sticky top-0) with slight elevation (shadow-sm)
- Height: h-16
- Layout: Flex justify-between items-center px-6
- Left: App logo/name (text-xl font-semibold)
- Right: User menu dropdown with avatar circle (w-8 h-8) and username

**Main Content Area:**
- Container: max-w-4xl mx-auto px-6 py-8
- Task list occupies full width within container

### 3. Task List View
**Header Section:**
- Title "My Tasks" (text-2xl font-semibold mb-6)
- Quick add task button (+ New Task) - prominent, rounded-lg, px-4 py-2

**Task Item Card:**
- Border rounded-lg with padding p-4
- Flex layout: checkbox (flex-shrink-0) | content (flex-1) | actions (flex-shrink-0)
- Hover state reveals action buttons (edit, delete)
- Spacing between tasks: space-y-3

**Task Item Structure:**
```
[Checkbox - w-5 h-5] [Task Content] [Actions - opacity-0 group-hover:opacity-100]
                      ├─ Title (font-medium)
                      └─ Description (text-sm, line-clamp-2)
                      └─ Timestamp (text-xs, metadata style)
```

**Empty State:**
- Centered vertically and horizontally
- Icon (Heroicons clipboard-document-list, w-16 h-16)
- Text: "No tasks yet" (text-lg font-medium)
- Subtext: "Create your first task to get started" (text-sm)
- Create task button below

### 4. Task Creation/Edit Modal
**Modal Overlay:** Fixed full-screen backdrop
**Modal Container:**
- Centered, max-w-lg, rounded-lg
- Padding: p-6
- Header: "New Task" / "Edit Task" (text-lg font-semibold mb-4)

**Form Layout:**
- Title input: Full-width, rounded-md, px-4 py-2, border
- Description textarea: Full-width, rounded-md, px-4 py-2, min-h-32, border
- Spacing between fields: space-y-4

**Action Buttons:**
- Flex layout: justify-end gap-3
- Cancel (secondary style, px-4 py-2, rounded-md)
- Save/Create (primary style, px-4 py-2, rounded-md)

### 5. Form Elements
**Text Input:**
- Border rounded-md
- Padding: px-4 py-2
- Focus state: ring-2 offset-2
- Placeholder styling: text-gray-400

**Textarea:**
- Same as text input
- Min height: min-h-32
- Resize: resize-none (controlled height)

**Checkbox:**
- Custom styled, w-5 h-5, rounded
- Checked state: filled with checkmark (Heroicons check)

**Buttons:**
- Border radius: rounded-md
- Padding: px-4 py-2 for standard, px-6 py-3 for prominent
- Icons from Heroicons (outline style)
- States: Base, hover (slight brightness increase), active (slight scale-down)

### 6. Icons
**Library:** Heroicons (CDN link)
**Standard Icons:**
- Plus: plus (new task)
- Trash: trash (delete)
- Pencil: pencil (edit)
- Check: check (complete task)
- User Circle: user-circle (profile)
- Clipboard: clipboard-document-list (empty state)
- X Mark: x-mark (close modal, remove)

**Icon Sizing:**
- Small actions: w-4 h-4
- Standard buttons: w-5 h-5
- Empty state: w-16 h-16

### 7. Task States
**Completed Task Styling:**
- Title: line-through, reduced opacity (opacity-60)
- Description: reduced opacity (opacity-40)
- Checkbox: filled state

**Incomplete Task:**
- Normal opacity and styling
- Checkbox: empty/outlined state

---

## Interaction Patterns

**Task Completion:**
- Click checkbox to toggle complete/incomplete
- Instant visual feedback (no page reload)
- Smooth transition for strikethrough (transition-all duration-200)

**Task Actions:**
- Actions (edit/delete) hidden by default
- Reveal on hover (group-hover pattern)
- Click outside modal to close (include backdrop click handler)

**Loading States:**
- Disable buttons during async operations
- Add loading spinner (w-4 h-4 animate-spin) inside button
- Replace button text with "Saving..." or "Deleting..."

---

## Accessibility Requirements

**Keyboard Navigation:**
- All interactive elements focusable
- Modal trapping (focus stays within modal)
- Escape key closes modals
- Enter key submits forms

**Focus Indicators:**
- Visible focus rings (ring-2 ring-offset-2)
- High contrast focus states
- Consistent across all interactive elements

**Labels:**
- All form inputs have associated labels (label element or aria-label)
- Checkbox has aria-label describing task action
- Buttons have descriptive text or aria-label

**Screen Reader Support:**
- Semantic HTML (header, main, nav, button, form)
- ARIA live regions for task updates
- Role="dialog" for modals

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (md)
- Desktop: ≥ 768px

**Mobile Adaptations:**
- Reduce container padding: px-4 instead of px-6
- Reduce task card padding: p-3 instead of p-4
- Stack modal actions vertically with space-y-2
- Always show task action buttons (no hover-only state)
- Reduce type scale slightly for smaller screens

---

## Images
**No hero images required** - This is a productivity application focused on functionality, not marketing. All visual hierarchy comes from typography, spacing, and component structure.