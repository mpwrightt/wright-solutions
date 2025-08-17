# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a Next.js 15 application for Wright AI Solutions, built with React 19 and TypeScript. The project follows the App Router pattern introduced in Next.js 13+.

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings) and Source Sans Pro (body text)

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Homepage with section components
  - `layout.tsx` - Root layout with fonts and metadata
  - `about/`, `contact/`, `services/` - Additional pages
- `components/` - Reusable React components
  - `ui/` - shadcn/ui base components (Button, Card, Input, etc.)
  - Section components (Hero, Services, Process, Benefits, CTA, Footer)
- `lib/` - Utility functions and shared logic
  - `utils.ts` - TailwindCSS class merging utilities

### Component Architecture
The homepage is built with modular section components imported into `app/page.tsx`. Each section is a self-contained component in the `components/` directory. The UI follows shadcn/ui patterns with customizable components in `components/ui/`.

### Styling System
- Uses TailwindCSS v4 with CSS variables for theming
- Dark mode is enabled by default in the root layout
- Font variables are defined for consistent typography
- shadcn/ui configuration in `components.json` with "new-york" style