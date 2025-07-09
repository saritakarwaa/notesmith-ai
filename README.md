# NoteSmith AI

NoteSmith AI is an intelligent study tool designed to streamline your learning process. By leveraging the power of Google's Gemini AI, this application can automatically summarize your notes, documents, or any text content, and generate interactive multiple-choice quizzes to help you test your knowledge.

## Features

- **AI-Powered Summarization**: Get concise summaries of lengthy text or documents.
- **Quiz from Content**: Automatically generate multiple-choice quizzes directly from your provided notes or documents.
- **Quiz by Topic**: Generate a quiz on any subject by simply providing a topic name.
- **Flexible Input**: Supports direct text input and file uploads (PDF, TXT, DOC, DOCX).
- **Interactive Quiz Interface**: Take quizzes directly within the app and get immediate feedback on your answers.
- **Modern & Responsive UI**: A clean and intuitive interface built with React, TypeScript, and Shadcn/ui.

## Tech Stack

**Frontend:**
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with a custom Catppuccin-inspired theme
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Icons**: Lucide React

**Backend:**
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: Google Gemini API
- **File Handling**: Multer for file uploads
- **Document Parsing**: pdf-parse for extracting text from PDF files

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add your Google Gemini API key:
    ```env
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Start the development server:**
    The server will run on `http://localhost:3000`.
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    The React application will be available at `http://localhost:5173`.
    ```bash
    npm run dev
    ```

The frontend is configured to proxy API requests to the backend server running on port 3000.

## API Endpoints

The backend exposes the following RESTful API endpoints:

-   `POST /api/summarize`
    -   Summarizes the provided content.
    -   **Body**: Accepts `multipart/form-data` with either a `text` field or a `file` field.
    -   **Response**: `{ "summary": "Generated summary text..." }`

-   `POST /api/generate-quiz`
    -   Generates a quiz from the provided content.
    -   **Body**: Accepts `multipart/form-data` with either a `text` field or a `file` field.
    -   **Response**: A JSON object containing quiz questions, options, and answers.

-   `POST /api/generate-quiz/topic`
    -   Generates a quiz based on a given topic.
    -   **Body**: `{ "text": "Your topic name" }`
    -   **Response**: A JSON object containing quiz questions, options, and answers.
