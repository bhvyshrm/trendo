# 🎬 trendo. — Premium Cinema & TV Discovery Platform

> Live Telemetry Stream • Editorial Cinema Index

**trendo.** is a production-quality cinema and television discovery platform built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It combines the editorial elegance of prestige film journals with the fluid, tactile polish of modern desktop operating systems, powered by official **The Movie Database (TMDB v3)** telemetry.

---

## Key Features

1. **Two Primary Discovery Categories**:
   - **Movies**: Daily Top 50 trending movies, box office telemetry, festival curations, and critics consensus.
   - **TV Shows**: Daily Top 50 trending series, premiere surges, and Emmy contenders.
2. **macOS Dock Magnification Physics**:
   - Proximity-based card magnification on cursor hover using organic cosine interpolation physics without disruptive layout shifts.
   - Top 3 Podium Aura Badges (#01 Gold Aura with animated radar glow, #02 Silver Medal, #03 Bronze Podium).
3. **Dual Discovery Views**:
   - **Vertical Dock View** (`view_agenda`): Editorial vertical ranking with narrative synopsis and telemetry stats.
   - **Compact Grid View** (`grid_view`): High-density golden ratio (2:3) poster gallery.
4. **Dedicated Details & Monograph Pages**:
   - Movie details (`/movie/:id`) and TV series details (`/tv/:id`).
   - Cinematic full-bleed backdrop viewports with obsidian scrims.
   - Dedicated **"Why it's trending"** telemetry section with verifiable TMDB signals (daily popularity index, vote average, vote count, release velocity).
   - Principal cast photo cards, directorial credits, production companies/networks, and recommended dispatches.
   - Embedded official YouTube trailers.
5. **Instant Search & Command Palette (`⌘K`)**:
   - Global search across movies and series with instant debounced TMDB querying.
6. **Tune Stream Filters & Sorting**:
   - Slide-over filter drawer with genre chips, release epoch, minimum TMDB rating slider, language selector, and 5 sorting modes (Rank, Popularity, Rating, Release Date, Alphabetical).
7. **Curated Reel (Watchlist)**:
   - Save noteworthy films and series directly to local storage with one-click dispatch access.
8. **Resilient Offline / Demo Mode**:
   - Includes a rich, curated fallback telemetry dataset if an API key is not immediately configured or network is unavailable, ensuring the application is always fully functional out of the box.

---

## 🎨 Design System Tokens
- **Background**: `#070707` (Pitch Obsidian)
- **Surfaces**: `#0e0e0e`, `#131313`, `#151517`, `#1c1b1b`, `#201f1f`, `#2a2a2a`
- **Text High Emphasis**: `#ffffff` / `#f5f5f5`
- **Text Muted**: `#8e9192` / `#707070`
- **Accent Highlight**: `#34d399` (Emerald 400 Telemetry Pulse), `#fbbf24` (Amber 400 Gold Aura)
- **Typography**: `Hanken Grotesk` (Editorial display & body), `Space Mono` (Telemetry slates & badges), `Syne` (Brand wordmark)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher; tested on v24)
- **npm** (v9 or higher)

### 2. Installation
```bash
# Clone the repository and navigate into the workspace
git clone https://github.com/bhvyshrm/trendo.git
cd trendo

# Install project dependencies
npm install
```

### 3. TMDB API Key Configuration (Optional for Live Telemetry)
The website is fully functional out of the box with the curated fallback dataset. To stream live real-time TMDB data:

1. Obtain a free v3 API key from [The Movie Database](https://www.themoviedb.org/settings/api).
2. Create a `.env` file in the project root:
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```
3. Alternatively, click the **key icon** in the top navigation bar of the running application to enter or test your TMDB API key directly in the UI.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
```
The compiled, type-checked, and minified production assets will be generated in `dist/`.

### 6. Previewing Production Build
```bash
npm run preview
```

---

## 📡 Data & Attribution

Movie and television telemetry is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).
This product uses the TMDB API but is not certified or endorsed by TMDB.

---

## 📄 License
MIT

---

<div align="center">

**trendo.**

*Cinema, in motion.*

</div>
