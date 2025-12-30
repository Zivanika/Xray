# Decision Flow Inspector

A web application for visualizing and inspecting decision-making pipelines, specifically designed for competitor analysis workflows. The tool provides step-by-step visibility into how products are analyzed, filtered, and ranked to identify optimal competitors.

## Project Overview

The Decision Flow Inspector uses an "XRay" pipeline approach to break down complex decision processes into discrete, inspectable steps. Each step logs its inputs, outputs, reasoning, and metadata, allowing users to understand exactly how decisions are made.

### Key Features

- **Pipeline Execution**: Run multi-step analysis pipelines with real-time step-by-step visualization
- **Execution Dashboard**: View all past pipeline executions with statistics and summaries
- **Detailed Inspection**: Drill down into individual executions to see each step's logic, inputs, outputs, and reasoning
- **Filter Evaluation**: Understand why products pass or fail specific filter criteria with detailed explanations

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd decision-flow-inspector

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

```sh
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Approach

### XRay Pipeline Architecture

The core of the application is the `XRay` class (`src/lib/xray.ts`), which implements a multi-step pipeline for competitor analysis:

1. **Keyword Generation**: Extracts relevant search terms from the reference product's title and category, combining product-specific terms with common category keywords.

2. **Candidate Search**: Uses generated keywords to search for potential competitor products. Currently uses mock data generation, but designed to integrate with real product APIs.

3. **Filter Application**: Applies configurable filters to candidates:
   - Price range (relative to reference product)
   - Minimum rating threshold
   - Minimum review count
   - Category matching

   Each product is evaluated against all filters, with detailed pass/fail reasoning for each criterion.

4. **Ranking & Selection**: Scores qualified candidates using a weighted formula:
   - Review count (40% weight)
   - Rating score (35% weight)
   - Price similarity (25% weight)

   The highest-scoring product is selected as the winner.

### Step Logging & Inspection

Each pipeline step logs:
- **Input**: What data was provided to the step
- **Output**: What the step produced
- **Reasoning**: Human-readable explanation of the step's logic
- **Metadata**: Additional context (timings, counts, configuration)
- **Evaluations**: For filter steps, detailed pass/fail analysis for each candidate

This comprehensive logging enables full transparency into the decision-making process.

### UI Components

- **Dashboard**: Overview of all executions with statistics (total executions, average duration, success rate)
- **Demo Page**: Interactive interface to run new pipelines with configurable filters
- **Execution Detail**: Step-by-step breakdown of a single execution with expandable step cards

## Known Limitations & Future Improvements

### Current Limitations

1. **In-Memory Storage**: Execution history is stored only in browser memory and is lost on page refresh. No persistence layer exists.

2. **Mock Data**: Product search uses generated mock data rather than real product APIs (e.g., Amazon Product Advertising API).

3. **Hardcoded Categories**: Category matching is currently hardcoded to "Water Bottles". The system doesn't dynamically adapt to different product categories.

4. **Single Scoring Algorithm**: The ranking formula uses fixed weights and doesn't allow customization or A/B testing of different scoring strategies.

5. **No Error Handling**: Pipeline failures aren't gracefully handled or logged. If a step fails, the entire execution may fail silently.

6. **Limited Filter Types**: Only supports price, rating, reviews, and category filters. Cannot handle more complex criteria like brand exclusions, feature matching, or availability checks.

7. **No Real-time Updates**: While steps are logged, there's no WebSocket or polling mechanism for real-time updates in a multi-user scenario.

8. **No Export/Import**: Cannot export execution results or import historical data for analysis.

### Planned Improvements

- **Persistent Storage**: Integrate a backend database (PostgreSQL/MongoDB) or use browser localStorage/IndexedDB for execution persistence
- **Real API Integration**: Connect to actual product search APIs (Amazon PA-API, Google Shopping, etc.)
- **Dynamic Category Detection**: Implement category inference from product attributes rather than hardcoding
- **Configurable Scoring**: Allow users to customize ranking weights and add custom scoring factors
- **Error Recovery**: Add retry logic, error boundaries, and detailed error logging
- **Extended Filtering**: Support for brand filters, feature matching, availability checks, and custom filter plugins
- **Real-time Collaboration**: WebSocket support for live pipeline monitoring and multi-user scenarios
- **Data Export**: CSV/JSON export of execution results and analytics
- **Pipeline Templates**: Save and reuse common filter configurations
- **Performance Optimization**: Implement caching, pagination for large result sets, and lazy loading of execution details

## Technologies Used

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **React Router** - Client-side routing
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages (Dashboard, Demo, ExecutionDetail)
├── lib/            # Core logic (XRay pipeline, types, utilities)
├── data/           # Mock data generators
└── hooks/          # Custom React hooks
```
