# Smart-Expense-Tracker
Smart Expense Tracker is a production-style, frontend-only finance app built with Next.js, React, TypeScript, and Tailwind CSS that helps users manage expenses with localStorage persistence, smart insights, custom categories, filtering, and savings goals in a polished, responsive UI.
# Smart Expense Tracker

A production-style, frontend-only expense tracker built with **Next.js App Router**, **React**, and **Tailwind CSS**.

This project is designed to demonstrate strong frontend engineering skills: state architecture, reusable components, performance optimizations, data visualization, and polished UX, all without any backend.

## Live Project Overview

- Fully frontend-only app (no backend, no API routes, no DB)
- Local persistence using browser `localStorage`
- Add / edit / delete expenses
- Category + month filtering
- Dashboard insights and charts
- Custom category management
- Savings goals + challenge mode
- Smart insights and monthly money story
- Responsive fintech-style UI with dark mode

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Persistence:** `localStorage` with JSON serialization

## Core Features

### Expense Management
- Add, edit, delete expenses
- Fields: `id`, `title`, `amount`, `category`, `date`
- Confirmation modal before delete
- Toast feedback for key actions

### Dashboard & Insights
- Total expenses
- Current month total
- Top category
- Category-wise pie chart
- Budget progress
- Smart insights (rule-based)
- Monthly story card auto-generated from expense data

### Filtering & Navigation
- Independent filter state for Overview and Transactions
- Category + month filtering
- Sidebar-based section navigation

### Customization
- User-defined categories (add/remove)
- INR formatting for amounts
- Dark/light mode persisted in `localStorage`

## Folder Structure

```txt
app/
  layout.tsx
  page.tsx
  globals.css

components/
  Dashboard.tsx
  ExpenseForm.tsx
  ExpenseList.tsx
  Filters.tsx
  Sidebar.tsx
  CategoryManager.tsx
  SmartInsights.tsx
  MonthlyMoneyStory.tsx
  SavingsGoals.tsx
  AppToaster.tsx
  ui/
    Button.tsx
    Card.tsx
    ConfirmModal.tsx
    EmptyState.tsx
    Input.tsx
    Skeleton.tsx

hooks/
  useExpenses.ts
  useFilters.ts
  useTheme.ts

utils/
  storage.ts
  format.ts
  export.ts
  cn.ts
```

## LocalStorage Data Model

- `smart-expense-tracker-expenses` -> `Expense[]`
- `smart-expense-theme` -> `"light" | "dark"`
- `smart-expense-budget` -> string/number budget value
- `smart-expense-categories` -> `string[]`
- `smart-expense-savings-goal` -> string
- `smart-expense-challenge-days` -> string

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Performance & Engineering Highlights

- `useMemo` for derived analytics/filtering
- `useCallback` for stable handlers and fewer re-renders
- Reusable UI primitives for consistency and maintainability
- Clean separation of concerns:
  - domain logic in hooks
  - presentation in components
  - persistence/helpers in utils

## Accessibility & UX

- Keyboard-friendly controls
- Focus-visible patterns on interactive components
- Confirmation handling for destructive actions
- Loading and empty states
- Responsive layout for mobile and desktop

## Interview Talking Points (Use This)

When presenting this project, emphasize:

1. **Frontend architecture:** How custom hooks (`useExpenses`, `useFilters`, `useTheme`) simplify and scale state logic.
2. **Data persistence:** How local-first apps can be robust using `localStorage` and guarded parsing/stringification.
3. **UX depth:** Toasts, modal confirmations, loading states, dark mode, and polished micro-interactions.
4. **Analytics layer:** Smart insights and story generation from raw expense data.
5. **Product thinking:** Sidebar navigation, independent filter contexts, custom categories, and profile-ready visual polish.

## Future Enhancements

- PWA install support
- Keyboard shortcuts / command palette
- Import/restore full backup JSON
- More advanced merchant clustering and trend insights

