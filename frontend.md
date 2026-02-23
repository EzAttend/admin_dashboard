# Smart Attendance Admin Panel — Frontend Redesign Spec

You are redesigning a **Smart Attendance Admin Dashboard** completely from scratch. Throw away the existing layout, color scheme, and component structure entirely.

---

## ⚠️ STRICT RULES — READ BEFORE MAKING ANY CHANGES

1. **DO NOT modify existing backend code** — All backend APIs, models, schemas, controllers, and routes are finalized. If a feature requires backend changes, **ASK FIRST** before implementing.

2. **DO NOT break existing functionality** — All current CRUD operations (create, read, update, delete) for Students, Teachers, Classes, Subjects, Rooms, Timetable, Sessions, and Attendance must continue working exactly as they do now.

3. **Frontend-only changes** — This redesign is purely visual/UX. Use existing API endpoints. Do not assume new endpoints exist.

4. **Additive, not destructive** — You may add new UI components, charts, and visualizations. You may NOT remove or alter the core data flow.

5. **When in doubt, ASK** — If implementing a feature seems to require backend support that doesn't exist, stop and ask rather than guessing.

---

## Design System
- **Color Scheme (STRICT)**: Charcoal dark background (#1a1a1a, #242424, #2e2e2e surface layers), Orange accent (#f97316, #ea580c for hover/active states), White/light gray text (#f5f5f5, #a3a3a3 muted)
- **Typography**: Use a bold, industrial display font for headings/KPIs, and a clean monospace or geometric sans for data/body
- **Feel**: Dark industrial dashboard — high contrast, data-dense, professional. Think Bloomberg terminal meets modern SaaS

## Layout (Completely New)
- Full sidebar navigation with orange icon highlights and active state indicator (left border bar in orange)
- Top bar with page-specific search (search students, teachers, sessions by name/ID), like if on teacher page showing the list of teachers, then search teachers
- Main content area using a rich card grid system (not tables — use metric cards, chart cards, status cards)
- Cards: rounded corners (8–12px), subtle dark border (#333), soft inner shadow, orange accents on key numbers/labels

---

## Features to Implement (mapped from e-commerce to attendance)

### Dashboard/Overview Page
**KPI Cards Row (top):**
- Total Students (with enrolled count)
- Today's Active Sessions
- Overall Attendance Rate % (with trend sparkline - last 7 days)
- Pending Enrollments (students not yet fully onboarded)

**Trend sparkline charts inside KPI cards** (mini SVG line charts showing 7-day trend)

**Low Attendance Alerts Section:**
- Orange/red-bordered cards listing students with <75% attendance rate
- Show: Student name, registration number, attendance %, class
- Orange "View Details" CTA button

**Attendance Distribution Donut Chart:**
- Present / Late / Absent percentages (green/yellow/red segments)
- Center shows total records count

**Recent Activity Feed (right panel):**
- Latest attendance records: "John Doe marked Present in CS101 Session"
- Latest session starts: "Session started for CSE-A, Room 301"
- New student enrollments

---

### Sessions Page (formerly Orders/Restock)
**Kanban-style board for session statuses:**
- Columns: Scheduled Today | Active Now | Completed | Cancelled
- Each card shows: Class name, Subject, Teacher, Room, Time, Student count

**OR Timeline View:**
- Vertical timeline showing today's sessions chronologically
- Past sessions grayed out, current session highlighted with orange border

**Quick Actions:**
- Start Session manually
- View attendance for session
- End session early

---

### Attendance Page
**Card grid view with toggle to switch between card/table view**

Each attendance card shows:
- Student photo placeholder (avatar with initials)
- Student name + registration number
- Status badge: Present (green) / Late (yellow) / Absent (red)
- Verification method badge: Face (blue-ish) / QR (orange)
- Confidence score progress bar (for face verification)
- Location verified checkmark
- Timestamp

**Filter sidebar (collapsible sections):**
- Status (Present/Late/Absent)
- Verification Method (Face/QR)
- Session/Date range
- Class filter
- Location Verified (Yes/No)

**Bulk actions toolbar:**
- Export selected
- Mark selected as...

---

### Analytics Page
**Full-width area chart:** Attendance trends over time (7/30/60 day toggles)
- Lines for Present %, Late %, Absent %

**Side-by-side bar charts:**
- Classes with highest attendance rate (Top 5)
- Classes with lowest attendance rate (Bottom 5)

**Key Metrics prominently displayed:**
- Overall Attendance Rate %
- Average Punctuality Rate (Present on time vs Late)
- Face Recognition Success Rate %
- QR Fallback Usage %

**Heatmap calendar:**
- Daily attendance activity (color intensity = attendance count)
- Click any day to drill down

**Teacher Performance Cards:**
- Sessions conducted
- Average attendance in their sessions
- Comparison to department average

---

### Students Page
**Rich card grid (not just table):**
- Student photo/avatar
- Name, Registration Number
- Class badge
- Enrollment status badge (Enrolled/Pending/Failed)
- Personal attendance rate % with mini progress bar
- Quick action: View full profile

**Enrollment funnel visualization:**
- Bar showing: Total → Enrolled → Pending → Failed

---

### Classes/Subjects/Rooms/Teachers/Timetable Pages
- Keep CRUD functionality but style with dark theme
- Use card-based display with orange accents
- Show related stats on each card (e.g., Room card shows "5 sessions this week")

---

### Import Jobs Page
**Timeline/progress view for imports:**
- Each job as a card showing progress bar
- Status: Pending (gray) → Running (orange pulse) → Completed (green) → Failed (red)
- Row-level error expansion

---

## Technical Requirements
- nextjs + Tailwind CSS (already using Tailwind v4)
- Recharts and chat.js whatever for all data visualizations (install if needed)
- Fully responsive (sidebar collapses to bottom nav on mobile)
- Smooth page transitions and hover micro-interactions
- All data fetched from existing API endpoints
- **No purple/blue gradients, no white backgrounds after redesign**
- Every page must feel rich, dense with useful information, and consistent with the charcoal+orange theme

## Quality Bar
- This should look like a $50k custom enterprise dashboard
- Every card, every number, every chart should feel intentional
- Use orange sparingly but powerfully — on CTAs, active states, critical alerts (low attendance), and key metrics only
- Add subtle grain texture or mesh gradient to the sidebar/background for depth

---

## Implementation Priority

### Phase 1 — Core Redesign
1. Update globals.css with dark theme
2. Redesign sidebar + layout component
3. Redesign Dashboard with KPI cards + charts

### Phase 2 — Data Pages
4. Sessions page with timeline/kanban
5. Attendance page with card grid + filters
6. Analytics page with charts

### Phase 3 — Polish
7. Student/Teacher profile cards
8. Import jobs visualization
9. Micro-interactions and transitions