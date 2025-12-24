# BeyondChats AI CMS: Automated Style Transfer
A full-stack system that scrapes web articles, uses Google Search to find professional style references, and employs Google Gemini AI to rewrite content into a professional tone.

## 🏗 System Architecture
The project is divided into three distinct phases/services:

Backend (Laravel): Serves as the primary database and API for storing raw and processed articles.

AI Service (Node.js/Express): Handles the "heavy lifting"—Google Custom Search API for references, Cheerio for web scraping, and Gemini 1.5 Flash for AI style transfer.

Frontend (React): A dashboard to view articles, trigger AI processing, and compare original vs. AI-styled content.

## 🚀 Getting Started
### 1. Backend (Laravel)
Database: Create a database named beyondchats_cms.

Setup:

```bash
composer install
php artisan migrate
php artisan serve
```
Endpoint: http://localhost:8000/api

### 2. AI Service (Node.js)
Environment Variables: Create a .env file in the phase2 folder:

```ini
GOOGLE_SEARCH_KEY=your_google_api_key
GOOGLE_CX=your_custom_search_engine_id
GEMINI_API_KEY=your_gemini_api_key
LARAVEL_API_URL=http://localhost:8000/api
```
npm start
Endpoint: http://localhost:3000

```bash
npm install
npm start
```

### 3. Frontend (React)
Setup:

```bash
npm install
npm start
```
Dashboard: http://localhost:3001

## 🛠 Features
### Phase 1: Scraper & Storage
Scrapes raw content from provided URLs.

Stores data in MySQL via Laravel Eloquent.

### Phase 2: AI Style Transfer
Contextual Search: Automatically searches Google for high-authority blogs based on the article title.

Resilient Scraping: Mimics browser headers to bypass 403 Forbidden errors on sites like Medium.

Gemini Integration: Rewrites content using the specific writing style of the discovered references.

### Phase 3: Interactive UI
Real-time Processing: Trigger AI processing directly from the card.

Visual Badging: Distinct styles for "Scraped Raw" vs. "AI Enhanced" articles.

Modal Preview: Full HTML rendering of the generated content.

## 📝 Technical Implementation Details
No Schema Changes: To maintain database integrity, AI-processed articles are distinguished using a title prefix [AI].

CORS Handling: Custom Express middleware handles pre-flight OPTIONS requests between the different ports.

Error Handling: Graceful fallbacks for failed scraping attempts or API rate limits.

## 🛡 License
Distributed under the MIT License. See LICENSE for more information.