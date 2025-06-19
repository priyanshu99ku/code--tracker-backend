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
- POST `/api/login`: User login
- POST `/api/register`: User registration
- GET `/api/questions`: Get all questions
- POST `/api/questions`: Add a new question
- DELETE `/api/questions/:id`: Delete a question
- PUT `/api/questions/:id`: Update a question
- POST `/api/questions/:questionId/answers`: Add an answer to a question
- GET `/api/questions/:questionId/answers`: Get all answers for a question


## Technologies Used

- Node.js
- Express.js
- Mongoose
- MongoDB
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- cookie-parser
- express-session
- axios
- node-fetch
- nodemon


## License

MIT License


## Author

Priyanshu Kumar



