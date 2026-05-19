# Delivery Drops Checklist

A mobile-first web app for delivery drivers to manage their daily route. Import drops via URL, reorder with drag-and-drop, mark deliveries as complete, and navigate with Google Maps — all offline after initial load.

## Features

- **URL Import** — Load drops from a `?data=` query parameter containing URL-encoded JSON
- **Safe Validation** — Zod schema validates each item; invalid items are skipped with a warning
- **Drag & Drop** — Reorder drops by dragging (touch-friendly on mobile)
- **Mark as Done** — Toggle completion with strikethrough visual feedback
- **Delete Drops** — Remove drops from the list
- **Google Maps Navigation** — One-tap navigation link opens Maps with the drop address
- **localStorage Persistence** — All state survives page reloads and browser restarts
- **Mobile-First UI** — Optimised for delivery drivers on the go
- **Offline Ready** — No API calls; works entirely client-side after initial load

## Screenshots

> _Screenshots coming soon._

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 + ShadCN UI |
| State | React hooks + localStorage |
| Validation | Zod |
| Drag & Drop | dnd-kit |
| Notifications | Sonner |
| Icons | Lucide React |

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd drops

# Install dependencies
npm install
```

## Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`.

## URL Data Format

Drops are imported via the `data` query parameter as a URL-encoded JSON array.

### Input Schema

Each item in the array must contain:

| Field | Type | Required | Format |
|---|---|---|---|
| `id` | string | Yes | Non-empty unique identifier |
| `name` | string | Yes | Business or recipient name |
| `address` | string | Yes | Street address |
| `postcode` | string | Yes | Postal code |
| `time` | string | Yes | `HH:MM` format (e.g. `08:30`, `14:00`) |

### Example Input

```json
[
  {
    "id": "01",
    "name": "Company A",
    "address": "123 Oxford Street",
    "postcode": "W1D 2HX",
    "time": "08:30"
  },
  {
    "id": "02",
    "name": "Company B",
    "address": "456 High Street",
    "postcode": "EC1A 1BB",
    "time": "09:00"
  }
]
```

### Example Test URL

```
http://localhost:5173/?data=%5B%7B%22id%22%3A%2201%22%2C%22name%22%3A%22Company%20A%22%2C%22address%22%3A%22123%20Oxford%20Street%22%2C%22postcode%22%3A%22W1D%202HX%22%2C%22time%22%3A%2208%3A30%22%7D%5D
```

### Partial Import

If some items in the array fail validation, valid items are imported and invalid items are skipped. A warning toast indicates how many items were skipped.

## Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces (Drop, StoredState)
├── utils/
│   ├── storage.ts            # localStorage read/write with versioning
│   ├── import.ts             # URL param extraction, JSON parsing, Zod validation
│   └── drop.ts               # Drop-specific helpers (merge, dedupe)
├── hooks/
│   └── useDrops.ts           # Single custom hook: state + all business logic
├── components/
│   ├── Header.tsx            # App title + done count badge
│   ├── DropList.tsx          # dnd-kit sortable list container
│   ├── DropCard.tsx          # Single drop: checkbox, details, drag handle, delete, navigate
│   ├── EmptyState.tsx        # "No drops yet" placeholder
│   └── CompletionBanner.tsx  # "All done!" indicator
├── lib/
│   └── utils.ts              # ShadCN cn() utility
├── App.tsx                   # Root component
├── main.tsx                  # Vite entry point
└── index.css                 # Tailwind + theme configuration
```

## Design Decisions

| Decision | Rationale |
|---|---|
| **Single hook for state** | One `useDrops` hook owns all state and logic — no context, no reducer, no external state library needed |
| **localStorage as source of truth** | Loaded once on mount, written on every mutation — simple and predictable |
| **No server** | Delivery drivers need offline reliability; no API dependency |
| **Partial validation** | Invalid items are skipped rather than rejecting the entire import — more resilient |
| **URL import replaces route** | A new `?data=` URL represents a fresh route — imported drops overwrite existing ones by ID |
| **dnd-kit over alternatives** | Better touch support, smaller bundle, actively maintained |
| **Mobile-first layout** | `max-w-md` centered column — stays narrow on desktop to match the mobile mental model |

## Known Limitations (v1)

- **Single route only** — no multi-route management or route naming
- **No undo** — deletions are immediate with no confirmation dialog
- **No dark mode** — light theme only
- **No authentication** — state is per-browser, no user accounts
- **URL length limits** — browser URL limits (~2000 chars) constrain import size
- **No search or filter** — list is expected to be short enough to scroll
- **No server sync** — data does not persist across devices or browsers
- **No route optimisation** — manual reordering only, no auto-sort by time or distance

## Future Improvements

- Multi-route support with route naming and switching
- Cloud sync via a lightweight backend
- Route optimisation (auto-sort by time or distance)
- Map view with pins for each drop
- Photo attachment for proof of delivery
- Notes field per drop
- Barcode or QR code scanning to confirm delivery
- Export route as shareable link
- Dark mode theme
- PWA support for installable app experience
- Drop grouping by area or zone
- Estimated completion time calculation

## License

[MIT](LICENSE)