# Gemini CLI Context for New World Expansion Research Project

This document provides an overview of the `new-world-expansion-research` project, its technologies, and development conventions, to serve as instructional context for the Gemini CLI.

## Project Overview

This project is a research tool for the game New World, specifically designed to assist end-game players with upcoming expansions, such as "Aeternum". It leverages the Google Gemini API to provide advanced, actionable tips, theory-crafting, and economic strategies based on the latest game information.

The application is a single-page application (SPA) built with:

- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API (via `@google/generative-ai` library)

The core functionality revolves around a search interface where users can input queries related to the New World expansion. The Gemini API processes these queries, acting as an expert MMORPG gamer, and returns nuanced advice, pre-farming strategies, build theory-crafting, and market insights. The application also maintains a history of past searches.

## Building and Running

The project uses `npm` for package management and `Vite` for development and building.

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/new-world-expansion-research.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd new-world-expansion-research
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This command compiles the application into static assets located in the `docs` directory, suitable for deployment (e.g., to GitHub Pages).

### Linting

To run ESLint checks:

```bash
npm run lint
```

## Development Conventions

### Technologies Used

- **Language:** TypeScript
- **Framework:** React
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Linting:** ESLint with TypeScript, React, React Hooks, and JSX A11y plugins.
- **AI:** Google Gemini API

### Code Structure

- `src/`: Contains the main application source code.
  - `components/`: Reusable React components (e.g., `Header`, `SearchBar`, `ResultsDisplay`, `HistoryLog`).
  - `services/`: API integrations and data handling, notably `geminiService.ts` for Gemini API interaction.
  - `App.tsx`: The root component of the application, managing global state and layout.
  - `index.tsx`: The entry point for rendering the React application.
- `public/`: Static assets.
- `docs/`: Output directory for production builds.

### Styling

- The project uses Tailwind CSS for utility-first styling.
- Custom font families are defined: `Inter` for sans-serif and `Cinzel` for serif.
- The `@tailwindcss/typography` plugin is used for enhanced typography.

### Linting and Type Checking

- ESLint is configured with a strict set of rules for TypeScript, React, and accessibility.
- Type-aware linting is enabled for most source files, with specific overrides for configuration files.
- TypeScript's strict mode is enabled in `tsconfig.json`, ensuring strong type checking.

### Environment Variables

- The application uses environment variables, particularly `VITE_API_KEY`, for the Gemini API key. These are loaded via `.env` files and accessed through `import.meta.env`.

### Gemini API Usage

- The `services/geminiService.ts` file encapsulates the logic for calling the Gemini API.
- A detailed `systemInstruction` is provided to the Gemini model, guiding its persona and response format to deliver advanced, actionable advice for end-game New World players.
- The `gemini-2.5-flash` model is used, and the `googleSearch` tool is enabled for grounding responses.
