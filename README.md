# Code Tracker Backend

A Node.js backend application for tracking code.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 by default. You can change this by modifying the PORT in the .env file.

## API Endpoints

- GET `/`: Welcome message 