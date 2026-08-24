# Subscription Tracker: Shared Build Contract

This file is the source of truth for the vibe-coding round. Read it before making changes. Keep it updated as work progresses so the human, Copilot, and Antigravity remain aligned.

## Goal

Build a clean, working full-stack app called **Subscription Tracker & Renewal Dashboard**.

The first screen is the usable dashboard, not a marketing page. Do not add authentication, a database, or unnecessary libraries. Backend storage is in memory and resets whenever the server restarts.

## Non-negotiable boundaries

- All validation, date calculations, monthly normalization, status changes, and dashboard calculations happen on the server.
- React handles presentation, form interaction, loading/error/empty states, and calling the API.
- React must never calculate monthly costs, renewal-day differences, renewal alerts, or metrics.
- Do not delete subscriptions when pausing them.
- Use plain CSS and `fetch`; do not add a UI component library.
- Keep implementation focused. No placeholder TODOs, fake functionality, authentication, or database.

## Ownership

### Backend owner

Own these files and behaviors under `server/`:

- Express app, CORS, JSON parsing, and startup script.
- In-memory seed data and subscription storage.
- Routes/controllers/services/utils separation where useful.
- Request validation and useful `400` errors.
- `404` handling for missing subscriptions/routes and `500` error handling.
- Calendar-safe renewal calculations.
- Active-only monthly burn rate and upcoming-renewal count.
- Status updates through the API.

### Frontend owner

Own these files and behaviors under `client/`:

- React/Vite app and components.
- Responsive dashboard layout and plain CSS.
- Add-subscription form and browser date picker.
- API loading, success, error, and empty states.
- Subscription table and amber `Renewing Soon` badge.
- Active/Paused toggle interaction.
- Rendering the server-provided values exactly as returned.
- Responsive behavior on desktop and mobile.

### Shared integration contract

- Do not change an API field name or response shape without updating this file and the other side.
- Do not duplicate backend business logic in the frontend.
- Keep changes small and testable.
- Before handing work back, record what was completed and which checks passed.

## Required project shape

```text
/
  client/
  server/
  README.md
  .gitignore
  ANTIGRAVITY_HANDOFF.md
```

Reasonable subdirectories are encouraged, for example:

```text
server/src/routes/
server/src/controllers/
server/src/services/
server/src/utils/
client/src/components/
client/src/services/
```

## API contract

Use a client development proxy or a configurable API base URL so the frontend can call the backend without hard-coded production assumptions.

### `GET /api/subscriptions`

Returns `200`:

```json
{
  "subscriptions": [
    {
      "id": "sub-1",
      "serviceName": "Netflix",
      "cost": 15.49,
      "billingCycle": "Monthly",
      "nextRenewalDate": "2026-08-28",
      "status": "active",
      "daysUntilRenewal": 4,
      "renewingSoon": true
    }
  ]
}
```

`daysUntilRenewal` and `renewingSoon` are server-computed response fields. The exact seeded dates may differ, but the response contract must remain stable.

### `POST /api/subscriptions`

Request:

```json
{
  "serviceName": "Notion",
  "cost": 10,
  "billingCycle": "Monthly",
  "nextRenewalDate": "2026-09-01"
}
```

Returns `201` with the created subscription, including server-computed renewal fields. New subscriptions are always `active`.

Reject with `400` when:

- `serviceName` is blank or missing.
- `cost` is missing, not numeric, or less than or equal to zero.
- `billingCycle` is anything other than exactly `Monthly` or `Yearly`.
- `nextRenewalDate` is missing or not a valid calendar date.

Use a consistent error shape, preferably:

```json
{ "error": "A useful message for the user" }
```

### `PATCH /api/subscriptions/:id/status`

Request:

```json
{ "status": "paused" }
```

Only `active` and `paused` are valid statuses. Returns `200` with the updated subscription and its computed renewal fields. Return `404` when the id does not exist and `400` for an invalid status.

### `GET /api/dashboard/metrics`

Returns `200`:

```json
{
  "totalMonthlyBurnRate": 42.73,
  "upcomingRenewals": 1
}
```

The metric endpoint is the only source for these dashboard totals.

## Business rules

### Monthly normalization

The backend calculates a comparable monthly cost:

- `Monthly`: `monthlyCost = cost`
- `Yearly`: `monthlyCost = cost / 12`

`totalMonthlyBurnRate` is the sum of normalized costs for `active` subscriptions only. Paused subscriptions contribute zero. Format currency only for display; do not alter stored numeric values.

### Renewal calculation

Treat dates as calendar dates, not timestamps. Parse the `YYYY-MM-DD` date components consistently on the server to avoid local-timezone off-by-one errors.

- `daysUntilRenewal` is the exact number of calendar days from the current server date to `nextRenewalDate`.
- `renewingSoon` is true only when `daysUntilRenewal >= 0 && daysUntilRenewal <= 7`.
- Already expired subscriptions are not renewing soon.
- `upcomingRenewals` counts active subscriptions where `renewingSoon` is true.

The current date must be obtained server-side. Tests should use dates relative to a controlled/fake current date where practical.

## UI requirements

Page order:

1. Title: `Subscription Tracker`.
2. Useful subtitle.
3. `Total Monthly Burn Rate` metric card.
4. `Upcoming Renewals` metric card.
5. Add Subscription form.
6. Responsive subscription table.

Table columns:

- Service
- Cost, showing the original formatted cost
- Billing Cycle
- Next Renewal, showing the date and the server-provided `Renewing Soon` amber badge when applicable
- Status, with a modern accessible toggle

Paused rows must be visibly greyed/dimmed and show `Paused`. Active rows must be visually restored. After a successful toggle response, refresh or replace the subscription list and metrics so the burn rate changes immediately. Show a loading state during requests and useful API errors when requests fail.

Use semantic labels, keyboard-accessible controls, clear focus states, and responsive layout. Avoid putting the entire page inside nested decorative cards. Keep typography strong and the visual language polished, restrained, and presentation-ready.

## Verification checklist

### Backend

- [ ] Server starts successfully.
- [ ] Seed data makes the dashboard non-empty.
- [ ] Blank name, invalid cost, invalid cycle, and invalid/missing date return `400`.
- [ ] Monthly and yearly normalization are correct.
- [ ] Paused subscriptions are excluded from both metrics.
- [ ] Today and the next 7 days are renewing soon; expired dates are not.
- [ ] Status changes persist in memory and invalid ids/statuses return the right errors.
- [ ] `200`, `201`, `400`, `404`, and `500` behavior is sensible.

### Frontend

- [ ] Client builds successfully.
- [ ] Seed subscriptions and both metrics render.
- [ ] Add flow displays backend validation errors and adds a valid subscription.
- [ ] Toggle pauses/resumes without deleting and refreshes metrics immediately.
- [ ] Loading, empty, and request-error states render cleanly.
- [ ] Desktop and mobile layouts do not overlap or overflow.
- [ ] Browser console has no application errors.

### Integration

- [ ] Backend and frontend commands are documented in `README.md`.
- [ ] API endpoint paths and response shapes match this contract.
- [ ] No monthly-cost, renewal-day, or metric calculations exist in React.

## Working protocol

1. Before editing, check this file and the current git diff.
2. Claim an area in the status log below before making a broad change.
3. Keep the other side informed through this document when an API contract changes.
4. Run the narrowest relevant check after each meaningful edit.
5. Do not commit unless explicitly requested.
6. At the end of a work session, update the status log and list remaining risks or checks.

## Status log

| Area | Owner | Status | Notes |
|---|---|---|---|
| Shared contract | Shared | Ready | This document defines the integration boundary. |
| Backend API and business rules | Backend owner | Not started |  |
| Frontend dashboard and styling | Frontend owner | Not started |  |
| README and `.gitignore` | Shared | Not started |  |
| Integration verification | Shared | Not started |  |

## Final handoff format

Before considering the assessment complete, record:

- Files created or materially changed.
- Backend and frontend commands to run.
- Tests/checks performed and their results.
- Any errors or known limitations remaining.
