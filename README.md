# Subscription Tracker

A full-stack subscription renewal dashboard with an in-memory backend. Track recurring services, compare monthly spend, and see renewals that are due within seven days.

## Features

- Add Monthly or Yearly subscriptions with server-side validation.
- View active and paused subscriptions with original cost and renewal date.
- See the total monthly burn rate for active subscriptions.
- Identify active subscriptions renewing today or within the next seven days.
- Pause and resume subscriptions without deleting them.
- Responsive React interface with loading, error, and empty states.

## Architecture

The `client/` React/Vite app owns presentation and API interactions. All network calls live in `client/src/services/api.js`. The `server/` Express app owns the in-memory data collection, controllers, routes, services, validation, and pure cost/date utilities. The server is the authority for every calculation.

## Tech stack

React, Vite, plain CSS, browser `fetch`, Node.js, Express, and CORS. No database or authentication is used.

## Setup and run

Install dependencies in two terminals:

```bash
cd server
npm install
npm start
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:3001`.

## API endpoints

- `GET /api/subscriptions` returns all subscriptions with server-computed renewal fields.
- `POST /api/subscriptions` validates and creates an active subscription.
- `PATCH /api/subscriptions/:id/status` changes a subscription to `active` or `paused`.
- `GET /api/dashboard/metrics` returns `totalMonthlyBurnRate` and `upcomingRenewals`.
- `GET /api/health` returns the server health status.

## Calculation rules

The server normalizes costs for comparison: Monthly subscriptions use their original cost, while Yearly subscriptions use `cost / 12`. The monthly burn rate sums normalized costs from active subscriptions only; paused subscriptions contribute zero.

Renewal dates are handled as UTC calendar dates to avoid timezone shifts. `daysUntilRenewal` is the calendar-day difference from the server's current date. A subscription is `renewingSoon` only when that value is between 0 and 7 inclusive. Expired subscriptions are excluded. The upcoming-renewals metric counts only active subscriptions with that flag.

## Notes

Data is intentionally in memory and resets when the backend restarts. This is an assessment application, so no production persistence is included.
