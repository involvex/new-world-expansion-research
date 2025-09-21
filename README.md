# Aeternum Research Tool

A modern web application for researching New World: Aeternum game content using Google's Gemini AI. Get detailed information about expansions, builds, crafting, and more through natural language queries.

## Features

- 🤖 **AI-Powered Research**: Uses Google's Gemini AI for comprehensive game research
- 🔍 **Natural Language Queries**: Ask questions in plain English about New World content
- 📚 **Source Citations**: View sources and references for research results
- 📜 **Search History**: Keep track of previous research queries
- 🎨 **Modern UI**: Beautiful, responsive design with dark theme
- ⚡ **Fast & Lightweight**: Built with React and Vite for optimal performance

## Prerequisites

- Node.js (v16 or higher)
- Google Gemini API key

## Quick Start

### No install with npx

```bash
npx aeternum-research-tool
```

## Installation

### Option 1: Install globally (Recommended)

```bash
npm install -g aeternum-research-tool
aeternum-research-tool
```

This will automatically download, build, and run the Aeternum Research Tool with a local server.

### Option 2: Install from source

1. Clone the repository:

   ```bash
   git clone https://github.com/involvex/new-world-expansion-research.git
   cd new-world-expansion-research
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your API key:
   - Create a `.env` file in the root directory
   - Add your Gemini API key:
     ```
     VITE_API_KEY=your_gemini_api_key_here
     ```
   - Alternatively, you can enter the API key directly in the app when prompted

## Usage

### Using npx (Simplest)

```bash
npx aeternum-research-tool
```

The tool will automatically:

- Build the application (if needed)
- Start a local server on `http://localhost:3000`
- Open your default browser
- Display the Aeternum Research Tool interface

### Using from source

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Enter your research query in the search bar (e.g., "What's the new level cap in Nighthaven?")

4. View the AI-generated research results with sources

### Features

- **AI-Powered Research**: Ask questions about New World Aeternum in natural language
- **Download Results**: Save research findings as markdown files
- **Source Citations**: View and access original sources
- **Search History**: Keep track of previous research queries

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini AI
- **Build Tool**: Vite
- **Linting**: ESLint with React and TypeScript support

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header
│   ├── SearchBar.tsx   # Search input component
│   ├── ResultsDisplay.tsx # Research results display
│   ├── HistoryLog.tsx  # Search history
│   └── icons.tsx       # Icon components
├── services/
│   └── geminiService.ts # Gemini AI integration
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main app component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

### Buymeacoffee

- `https://www.buymeacoffee.com/involvex`
