# Phase 2: Node.js AI Service

This directory contains the Node.js/Express application that performs the AI style transfer. It fetches an article from the Laravel backend, finds style references using Google Search, and then uses the Google Gemini AI to rewrite the article in a professional tone.

## Features

*   **AI Style Transfer:** Rewrites articles using a generative AI model (Gemini 2.5 Flash).
*   **Contextual Search:** Searches Google for relevant style references.
*   **Web Scraping:** Scrapes the content of reference articles.
*   **Resilient:** Mimics browser headers to avoid being blocked.

## API Endpoints

| Method | URI | Description |
| --- | --- | --- |
| POST | `/api/process-article/:id` | Process and rewrite an article. |

## Environment Variables

Create a `.env` file in this directory with the following variables:

```
GOOGLE_SEARCH_KEY=your_google_api_key
GOOGLE_CX=your_custom_search_engine_id
GEMINI_API_KEY=your_gemini_api_key
LARAVEL_API_URL=http://localhost:8000/api
```

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start Server:**
    ```bash
    npm start
    ```
The AI service will be available at `http://localhost:3000`.

## Libraries Used

*   **Express:** The web framework used to create the API endpoint for processing articles.
*   **Axios:** Used to make HTTP requests to the Laravel API (to fetch/update articles) and to the Google Search API.
*   **Cheerio:** Used to parse the HTML from reference articles and extract their text content.
*   **@google/generative-ai:** The official Google client library to interact with the Gemini 2.5 Flash model for the style transfer.
*   **CORS:** A middleware to handle Cross-Origin Resource Sharing, allowing the React frontend (on port 3001) to communicate with this service (on port 3000).
*   **dotenv:** Used to load sensitive API keys and configuration from the `.env` file.
*   **Nodemon:** A development tool that automatically restarts the server when file changes are detected.
