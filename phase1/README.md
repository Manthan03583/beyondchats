# Phase 1: Laravel Backend

This directory contains the Laravel application that serves as the backend for the AI Content Management System. It provides a RESTful API for managing articles and includes a command for scraping articles from the BeyondChats blog.

## Features

*   **RESTful API:** Provides endpoints for CRUD operations on articles.
*   **Database:** Uses MySQL to store articles.
*   **Scraping:** Includes an Artisan command to scrape articles from the BeyondChats blog.

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | URI | Description |
| --- | --- | --- |
| GET | `/articles` | Fetch all articles. |
| POST | `/articles` | Store a new article. |
| GET | `/articles/{id}` | Fetch a single article. |
| PUT | `/articles/{id}` | Update an article. |
| DELETE | `/articles/{id}` | Delete an article. |
| GET | `/articles/latest-unprocessed` | Fetch the latest unprocessed article. |

## Database Schema

The `articles` table has the following fields:

*   `id`: Primary key.
*   `title`: The title of the article.
*   `content`: The content of the article.
*   `source_url`: The original URL of the article.
*   `is_processed`: A boolean flag to indicate if the article has been processed by the AI service.
*   `created_at`: Timestamp of when the article was created.
*   `updated_at`: Timestamp of when the article was last updated.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    composer install
    ```
2.  **Create Database:** Create a MySQL database named `beyondchats_cms`.
3.  **Run Migrations:**
    ```bash
    php artisan migrate
    ```
4.  **Scrape Articles:**
    ```bash
    php artisan scrape:articles
    ```
5.  **Start Server:**
    ```bash
    php artisan serve
    ```
The API will be available at `http://localhost:8000/api`.