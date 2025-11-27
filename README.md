Memonies – Daily Salary Payout Platform
======================================

Memonies replaces rigid monthly payrolls with earned daily salary (EDS) so teams can close their workday and see money land instantly. This repository hosts the React Native / Expo application that powers employer control, employee visibility, attendance logs, and automated payouts.

## Core Experience

- **Employers** create a company wallet, onboard workers with invite codes, assign daily rates, and trigger (or automate) end‑of‑day payouts.
- **Employees** complete KYC, clock in/out with optional GPS, see their earnings grow through the day, and receive funds in the Memonies wallet or a preferred bank account at 6 PM.
- **Wallet + Ledger** reuse the existing infrastructure for deposits, withdrawals, and transaction history.
- **Notifications** alert users about clock‑in reminders, payout success, funding needs, or employer messages.

## Feature Highlights

- **Role-aware home** – `src/screens/Bottom/Home.tsx` renders distinct dashboards for employers and employees, including wallet health, team attendance, daily earnings, payout timelines, and actionable shortcuts.
- **Attendance + GPS** – `Attendance.tsx` lets workers clock in/out with optional GPS snapshots while employers can approve shifts, trigger manual payouts, and monitor wallet shortfalls.
- **Automated payouts** – The Redux `edsSlice` models autopayout schedules, destinations (wallet or bank), and keeps an audit-friendly ledger of runs plus notifications.
- **Wallet + transfers** – Existing send, receive, card linking, and withdrawal flows are repurposed to fund employer wallets and let employees cash out earnings on demand.
- **Domain bootstrap** – `useEdsBootstrap` centrally hydrates summaries, attendance, teams, and payout runs so every screen stays in sync with the API.

## Daily Salary Flow

1. Employers fund the company wallet, set autopayout rules, and invite workers with company codes.
2. Employees complete KYC, choose wallet or bank payouts, then clock in/out from the Attendance tab (with optional GPS enforcement).
3. At the autopayout window (default 6 PM), Memonies debits the employer wallet, marks attendance as paid, and credits employee wallets or linked banks.
4. Notifications and transaction history provide audit logs, while employers can trigger manual runs or reconcile shortfalls from the Home dashboard.

## Tech Stack

- React Native 0.79 / Expo 53
- Redux Toolkit + redux‑persist for auth + EDS state
- React Query for server data (wallets, transactions, KYC, etc.)
- Tailwind (twrnc) + custom components for layout and typography
- Expo services: Notifications, Location, Tracking Transparency, biometrics

## Getting Started

1. Install dependencies
   ```bash
   yarn install
   ```
2. Create a `.env` or use the `eas.json` profiles for API hosts.
3. Start the Expo dev server
   ```bash
   yarn start
   ```
4. Run on a device / simulator via the prompts. Location + notification permissions are required for attendance + alerts.

## Scripts

- `yarn start` – clean Expo start
- `yarn android` / `yarn ios` – run on native shells
- `yarn test` – (coming soon) app level tests
- `yarn ts:check` – type safety

## Project Structure

- `src/assets` – icons, illustrations, animations
- `src/components` – reusable UI primitives
- `src/navigation` – auth + app stacks
- `src/redux` – auth + earned daily salary slices
- `src/screens` – Auth, Dashboard, EDS flows, Wallet, etc.
- `src/utils` – API helpers, formatting, validation

## Environment Variables

See `eas.json` for the current staging/production placeholders. Inject `EXPO_PUBLIC_API_BASE_URI` and `EXPO_PUBLIC_STAGING_API_BASE_URI` during builds.

## Contributing

1. Fork & branch (`feat/<feature-name>`)
2. `yarn lint && yarn ts:check`
3. Open a PR describing scope + screenshots/video of major UI changes

## License

Proprietary © 2025 Memonies. All rights reserved.