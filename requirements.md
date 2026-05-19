# Delivery Drops Checklist — Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-05-19

---

## 1. Project Overview

The Delivery Drops Checklist is a mobile-first web application that allows delivery drivers to manage their daily route. Drops are imported via a URL query parameter containing a URL-encoded JSON array. Drivers can reorder their route, mark deliveries as complete, and remove drops as needed. All state is persisted locally in the browser.

### Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- ShadCN UI
- localStorage (client-side persistence)
- Sonner (toast notifications)
- dnd-kit (drag and drop)
- Zod (schema validation)

---

## 2. Functional Requirements

### 2.1 Import Drops

| ID | Requirement |
|---|---|
| FR-01 | The app shall read the `data` query parameter from the URL on load |
| FR-02 | The app shall URL-decode and JSON-parse the `data` parameter value |
| FR-03 | The app shall validate each item in the parsed array against the defined schema |
| FR-04 | The app shall import all valid items and skip invalid ones |
| FR-05 | The app shall display a warning toast indicating how many items were skipped due to validation failure |
| FR-06 | The app shall display a success toast indicating how many items were imported |
| FR-07 | The app shall remove the `data` query parameter from the URL after processing (via `history.replaceState`) |

### 2.2 Display Drops

| ID | Requirement |
|---|---|
| FR-08 | The app shall display all drops in a scrollable list |
| FR-09 | Each drop card shall display: name, address, postcode, and scheduled time |
| FR-10 | The app shall display a drop count badge (e.g. "3/8 done") |
| FR-11 | The app shall display an empty state message when no drops exist |

### 2.3 Mark as Done

| ID | Requirement |
|---|---|
| FR-12 | Each drop shall have a toggle control to mark it as done |
| FR-13 | Done drops shall be visually indicated with a strikethrough and reduced opacity |
| FR-14 | The done state shall persist across page reloads |

### 2.4 Reorder Drops

| ID | Requirement |
|---|---|
| FR-15 | Users shall be able to reorder drops via drag and drop |
| FR-16 | The reordered list shall persist across page reloads |
| FR-17 | Drag and drop shall work on touch devices |

### 2.5 Delete Drops

| ID | Requirement |
|---|---|
| FR-18 | Each drop shall have a delete control |
| FR-19 | Deletion shall be immediate with no confirmation dialog |
| FR-20 | Deleted drops shall not reappear on subsequent imports of the same ID |

---

## 3. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | The UI shall be mobile-first, optimized for screens 375px and above |
| NFR-02 | All interactive elements shall have a minimum touch target of 44×44px |
| NFR-03 | The app shall load and be interactive within 2 seconds on a standard mobile connection |
| NFR-04 | The app shall function offline after initial load (no API calls) |
| NFR-05 | The app shall handle localStorage unavailability gracefully (fallback to in-memory state) |
| NFR-06 | The app shall not crash on malformed or malicious input in the `data` parameter |

---

## 4. Data Model

### 4.1 Raw Input (from URL)

```typescript
interface RawDrop {
  id: string;       // Required. Unique identifier for the drop
  name: string;     // Required. Business or recipient name
  address: string;  // Required. Street address
  postcode: string; // Required. Postal code
  time: string;     // Required. Scheduled delivery time (HH:MM format expected)
}
```

### 4.2 Internal Drop

```typescript
interface Drop {
  id: string;
  name: string;
  address: string;
  postcode: string;
  time: string;
  done: boolean;    // Default: false
}
```

### 4.3 Persisted State

```typescript
interface StoredState {
  drops: Drop[];           // Ordered list of drops
  deletedIds: string[];    // Tombstone list of deleted drop IDs
}
```

### 4.4 localStorage Key

| Key | Value |
|---|---|
| `drops_app_state` | JSON-serialized `StoredState` |

---

## 5. Business Rules

| ID | Rule |
|---|---|
| BR-01 | A new URL import represents a fresh route. Imported drops overwrite existing drops with matching IDs |
| BR-02 | Re-imported drops shall always have `done` reset to `false` |
| BR-03 | Drops whose ID appears in `deletedIds` shall be excluded from import |
| BR-04 | Partial validation: valid items are imported; invalid items are silently skipped with a warning count |
| BR-05 | Drop IDs are treated as strings and compared as such |
| BR-06 | The order of drops in the imported array becomes the initial order (after merging with existing drops) |

---

## 6. UI Requirements

### 6.1 Layout

```
┌─────────────────────────────┐
│  Drops Checklist    3/8 ✓   │  ← Header with title + count badge
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ ☐  Company A          │  │  ← Drop card (undone)
│  │    123 Oxford Street   │  │
│  │    W1D 2HX    08:30 ☰ │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ☑  Company B          │  │  ← Drop card (done, crossed out)
│  │    456 High Street     │  │
│  │    EC1A 1BB   09:00 ☰ │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ☐  Company C          │  │
│  │    789 Park Lane       │  │
│  │    SW1A 1AA   09:30 ☰ │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

### 6.2 Drop Card

Each card shall contain:

- **Checkbox/toggle** (left) — marks the drop as done/undone
- **Name** — bold, primary text
- **Address** — secondary text
- **Postcode** — secondary text, same line as time
- **Time** — monospace or tabular-nums, aligned right
- **Drag handle** (right) — grip icon for reordering
- **Delete button** (right) — trash icon, subtle until hovered/focused

### 6.3 States

| State | Visual Treatment |
|---|---|
| Default | White card, subtle shadow, full opacity |
| Done | Strikethrough on name, reduced opacity (60%), muted text color |
| Dragging | Elevated shadow, slight scale, semi-transparent placeholder |
| Empty | Centered message: "No drops yet. Import a route via the URL." |

### 6.4 Toast Notifications

| Trigger | Type | Message |
|---|---|---|
| Successful import | Success | "X drops imported" |
| Partial import | Warning | "X drops imported, Y skipped" |
| Failed import | Error | "Invalid route data" |
| Delete | Undo toast (optional) | "Drop removed" |

---

## 7. Persistence Requirements

| ID | Requirement |
|---|---|
| PR-01 | All state changes (reorder, toggle, delete, import) shall be written to localStorage synchronously |
| PR-02 | State shall be loaded from localStorage on app initialization |
| PR-03 | If localStorage is unavailable, the app shall operate in-memory with a warning |
| PR-04 | The stored state shall be a single JSON object under one key for atomic updates |
| PR-05 | The state structure shall be versioned to support future migrations |

---

## 8. Edge Cases

| ID | Scenario | Expected Behavior |
|---|---|---|
| EC-01 | `?data=` parameter is absent | Load from localStorage only; no toast |
| EC-02 | `?data=` is not valid URL-encoded JSON | Show error toast; ignore import |
| EC-03 | `?data=` parses to a non-array value | Show error toast; ignore import |
| EC-04 | `?data=` contains an empty array `[]` | No drops imported; no error |
| EC-05 | `?data=` contains items missing required fields | Skip invalid items; import valid ones |
| EC-06 | `?data=` contains items with wrong field types | Skip invalid items; import valid ones |
| EC-07 | `?data=` contains duplicate IDs within itself | Keep the last occurrence |
| EC-08 | `?data=` contains IDs already in localStorage | Overwrite with new data; reset done=false |
| EC-09 | `?data=` contains IDs in deletedIds | Skip those items; do not re-import |
| EC-10 | localStorage is full | Show warning; continue in-memory |
| EC-11 | All drops are marked done | Show completion indicator |
| EC-12 | URL contains other query parameters | Ignore; only process `data` |
| EC-13 | User reloads page mid-drag | State remains consistent (no partial drag state persisted) |

---

## 9. Non-Goals (v1)

The following are intentionally excluded from v1:

- **Authentication or user accounts** — the app is stateless per browser
- **Server-side storage or sync** — all data is local
- **Route optimization** — manual reordering only
- **Maps or navigation integration** — no map view
- **Photo capture or proof of delivery** — text-only checklist
- **Push notifications or reminders** — no scheduling engine
- **Export or share functionality** — no PDF, CSV, or link sharing
- **Multi-route management** — single active route at a time
- **Search or filter** — list is short enough to scroll
- **Undo/redo** — deletions are immediate
- **Dark mode** — light theme only for v1
- **Accessibility audit** — basic a11y only (semantic HTML, labels)

---

## 10. Future Improvements (v2 Ideas)

- Multi-route support with route naming and switching
- Cloud sync via a lightweight backend
- Route optimization (auto-sort by time or distance)
- Map view with pins for each drop
- Photo attachment for proof of delivery
- Notes field per drop
- Barcode or QR code scanning to confirm delivery
- Export route as shareable link
- Dark mode theme
- PWA support for installable app experience
- Offline-first with background sync
- Drop grouping by area or zone
- Estimated completion time calculation
- Integration with delivery management APIs
