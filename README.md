# Pokédex Lite

A premium, highly responsive Pokédex web application built with modern web technologies. This project was developed as an assignment to demonstrate robust frontend architecture, responsive design, and seamless user experience.

## 🚀 Features

- **Data Fetching:** Real-time data retrieval from the public [PokéAPI](https://pokeapi.co/).
- **Infinite Scrolling Pagination:** Seamlessly load more Pokémon as you scroll without jarring page reloads, using the native `IntersectionObserver` API.
- **Search & Filter:** Search for Pokémon by name instantly, or filter them by specific elemental types (Fire, Water, Grass, etc.).
- **Favorites System:** "Heart" your favorite Pokémon. Favorites are persisted in `localStorage` so they remain even after refreshing the page.
- **Detailed Views:** Click on any Pokémon to view a detailed breakdown including height, weight, abilities, and a dynamic stat bar interface.
- **Premium UI/UX:** 
  - Glassmorphism design elements.
  - Type-colored organic background blobs for a dynamic, immersive aesthetic.
  - Smooth, GPU-accelerated micro-animations.
  - A clean, off-white layout with a subtle texture overlay.
- **Fully Responsive:** Beautifully scaled across mobile devices, tablets, and desktop monitors.

## 💻 Technologies Used

- **Framework:** [Next.js (App Router)](https://nextjs.org/) - Chosen for its powerful server components, intuitive routing, and built-in optimization tools (like `next/image`).
- **Language:** TypeScript - For strict type safety, better developer experience, and more robust API data handling.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Used for rapid UI development, consistent design tokens, and highly maintainable utility classes.
- **Icons:** [Lucide React](https://lucide.dev/) - For clean, scalable, and consistent vector icons.

## ⚙️ Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository** (if applicable) or download the source code.
2. **Navigate to the project directory:**
   ```bash
   cd pokedex-lite
   ```
3. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🛠️ Challenges Faced & Solutions

1. **Hydration Mismatches with Browser Extensions**
   - *Challenge:* Next.js was throwing hydration errors because Chrome extensions were modifying the DOM before React could hydrate it.
   - *Solution:* Added the `suppressHydrationWarning` attribute to the `<html>` and `<body>` tags in `layout.tsx` to ensure stable hydration.

2. **Performance Bottlenecks with Heavy Animation Libraries**
   - *Challenge:* Initially, heavy animation libraries were considered for card hover effects, which caused render-blocking and frame drops on lower-end devices.
   - *Solution:* Ripped out heavy JS-based animations and implemented pure, GPU-accelerated CSS transitions (`transform`, `opacity`, `backdrop-filter`). This achieved buttery-smooth 60fps animations with zero bundle bloat.

3. **Infinite Render Loop during Pagination**
   - *Challenge:* While implementing the "Load More" functionality, managing the `page` state inside the fetch callback dependency array caused an infinite re-render loop.
   - *Solution:* Decoupled the state by passing the specific `currentPage` as a parameter to the fetch function and carefully managing the `useCallback` dependencies. Upgraded this system to use `IntersectionObserver` for a flawless infinite scroll experience instead of a manual button click.

4. **N+1 API Fetching Overhead**
   - *Challenge:* The PokéAPI `list` endpoint only returns the `name` and `url`. Getting the "Type" to color-code the cards correctly required an additional API call for every single card rendered, potentially slowing down the list.
   - *Solution:* Implemented **batch fetching** at the parent level (`HomeClient.tsx`). Instead of having each card independently fetch its own data (which causes N+1 waterfalls and unexpected performance issues), the main list resolves chunks of exactly 24 Pokémon concurrently using `Promise.all`. Furthermore, when filtering by type (which natively returns hundreds of Pokémon at once from PokéAPI), the list caches the result and performs client-side slicing to ensure we only ever batch-fetch what is actively visible on the screen.

## ☁️ Deployment

This Next.js application can be effortlessly deployed to Vercel.
1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and import the repository.
3. Vercel will automatically detect Next.js and build the application.
