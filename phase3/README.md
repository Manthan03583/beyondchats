# Phase 3: React Frontend

This directory contains the React application that serves as the frontend for the AI Content Management System. It provides a dashboard to view articles, trigger the AI style transfer process, and compare the original and AI-styled content.

## Features

*   **Article Dashboard:** Displays a list of articles, with a visual distinction between original and AI-styled articles.
*   **Real-time Processing:** A button on each original article allows the user to trigger the AI style transfer process.
*   **Content Preview:** A modal allows the user to view the full HTML content of an article.

## API Communication

*   **Laravel Backend (http://localhost:8000/api):** Used to fetch the list of articles.
*   **Node.js AI Service (http://localhost:3000/api):** Used to trigger the AI style transfer process.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Application:**
    ```bash
    npm start
    ```
The frontend will be available at `http://localhost:3001`.