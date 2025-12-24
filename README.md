# BeyondChats AI CMS: Automated Style Transfer

A full-stack system that scrapes web articles, uses Google Search to find professional style references, and employs Google Gemini AI to rewrite content into a professional tone.

## 🏗 System Architecture

The project is divided into three distinct services that work together:

1.  **Phase 1: Laravel Backend (`/phase1`)**
    *   Serves as the central database and API for storing raw and processed articles. It's the single source of truth for all content.

2.  **Phase 2: Node.js AI Service (`/phase2`)**
    *   Handles the "heavy lifting" of AI processing. It communicates with the Laravel backend and external services to perform the style transfer.

3.  **Phase 3: React Frontend (`/phase3`)**
    *   Provides a user-friendly dashboard to view articles, trigger the AI processing, and compare the original and AI-enhanced content.

---

## 🛠 Features & Technical Details

### Phase 1: Laravel Backend

This service is a standard Laravel application responsible for data persistence and providing a RESTful API.

*   **Scraper & Storage:** Includes an Artisan command (`scrape:articles`) that scrapes the 5 oldest articles from the BeyondChats blog and stores them in a MySQL database.
*   **API Endpoints:** Exposes a full set of CRUD endpoints for managing articles.

#### API Endpoints

All endpoints are prefixed with `/api`.

| Method | URI | Description |
| --- | --- | --- |
| GET | `/articles` | Fetch all articles. |
| POST | `/articles` | Store a new article. |
| GET | `/articles/{id}` | Fetch a single article. |
| PUT | `/articles/{id}` | Update an article. |
| DELETE | `/articles/{id}` | Delete an article. |
| GET | `/articles/latest-unprocessed` | Fetch the latest unprocessed article. |

---

### Phase 2: Node.js AI Service

This service orchestrates the core AI functionality of the application.

*   **Contextual Search:** When triggered, it automatically searches Google for high-authority blogs based on the article's title to use as style references.
*   **Resilient Scraping:** It uses `axios` and `cheerio` to scrape the content from the reference URLs, mimicking browser headers to reduce the chance of being blocked.
*   **Gemini Integration:** It uses the `gemini-1.5-flash` model to rewrite the original article's content, adopting the tone and style of the scraped reference material.
*   **Workflow (`POST /api/process-article/:id`):**
    1.  Fetches the original article from the Laravel API.
    2.  Searches Google for style references.
    3.  Scrapes the content of the reference articles.
    4.  Sends the original content and reference styles to the Gemini API.
    5.  Saves the AI-generated content as a *new* article in the Laravel backend, prefixed with `[AI]`.
    6.  Marks the original article as `is_processed`.

---

### Phase 3: React Frontend

A modern, responsive dashboard built with React and Tailwind CSS.

*   **Real-time Processing:** Users can click a button on an article card to trigger the AI style transfer process via the Node.js service.
*   **Visual Badging:** The UI uses distinct styles to clearly differentiate between "Scraped Raw" and "AI Enhanced" articles.
*   **Modal Preview:** Provides a clean, readable modal to view the full HTML content of any article.
*   **API Communication:**
    *   Fetches the list of all articles from the Laravel backend.
    *   Sends requests to the Node.js service to initiate AI processing.

---

## 🚀 Getting Started

To run the full system, you must start all three services in separate terminals.

### 1. Backend (Laravel)

```bash
# Navigate to the phase1 directory
cd phase1

# Install dependencies
composer install

# Create a MySQL database named `beyondchats_cms`

# Run database migrations
php artisan migrate

# Optional: Scrape initial articles
php artisan scrape:articles

# Start the server
php artisan serve
# --> API will be running at http://localhost:8000/api
```

### 2. AI Service (Node.js)

```bash
# Navigate to the phase2 directory
cd phase2

# Create a .env file with the following content:
# GOOGLE_SEARCH_KEY=your_google_api_key
# GOOGLE_CX=your_custom_search_engine_id
# GEMINI_API_KEY=your_gemini_api_key
# LARAVEL_API_URL=http://localhost:8000/api

# Install dependencies
npm install

# Start the server
npm start
# --> AI Service will be running at http://localhost:3000
```

### 3. Frontend (React)

```bash
# Navigate to the phase3 directory
cd phase3

# Install dependencies
npm install

# Start the application
npm start
# --> Dashboard will be accessible at http://localhost:3001
```

## 🛡 License

Distributed under the MIT License.
