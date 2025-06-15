# Gemini Chat App

A full-stack AI chat application using Google Gemini (backend: FastAPI, frontend: React + Vite + TailwindCSS).

---

## Project Structure

```
gemini-chat-app/
├── backend/
│   ├── main.py              # FastAPI backend server
│   ├── .env                 # Gemini API key
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html           # Main HTML entry for Vite
│   ├── index.css            # Global styles
│   ├── postcss.config.js    # PostCSS config
│   ├── tailwind.config.js   # TailwindCSS config
│   └── src/
│       ├── App.jsx          # Main React app
│       └── main.jsx         # React entry point
```

---

## Getting Started

### 1. Backend Setup

1. **Clone the repository** and navigate to the backend folder:
    ```sh
    cd backend
    ```

2. **Create a virtual environment** and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

4. **Set up your `.env` file** with your Gemini API key:
    ```
    GEMINI_API_KEY=your-gemini-api-key
    ```

5. **Run the FastAPI server**:
    ```sh
    uvicorn main:app --reload
    ```

   The backend will be available at `http://localhost:8000`.

---

### 2. Frontend Setup

1. **Navigate to the frontend folder**:
    ```sh
    cd frontend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the development server**:
    ```sh
    npm run dev
    ```

   The frontend will be available at `http://localhost:5173` (or as indicated in your terminal).

---

## Usage

- Open the frontend in your browser.
- Start chatting with the Gemini-powered AI assistant.
- The backend handles requests at `/chat` and communicates with Gemini.

---

## Notes

- Make sure the backend is running before using the frontend.
- Update CORS settings in [`backend/main.py`](backend/main.py) for production.
- Store your API keys securely and never commit them to version control.

---

## License

MIT