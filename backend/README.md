# Hackathon Hero Backend

This is the Node.js/Express backend for the Hackathon Hero application, using MongoDB for data storage.

## Setup

1.  Make sure you have [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (if not exists) with:
    ```env
    MONGO_URI=mongodb://localhost:27017/hackathon-hero
    PORT=5001
    ```

## Running

*   Development mode (restarts on changes):
    ```bash
    npm run dev
    ```
*   Production mode:
    ```bash
    npm start
    ```

## API Endpoints

*   **Tasks**: `GET/POST/PUT/DELETE /api/tasks`
*   **Hackathons**: `GET/POST/PUT/DELETE /api/hackathons`
