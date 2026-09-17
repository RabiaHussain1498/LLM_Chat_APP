# LLM Chat App

A full-stack chat application with a FastAPI backend that routes requests to multiple LLM providers (Ollama, OpenAI, Gemini) through a single, unified interface, and a React (Vite) frontend.

## Project Structure

```
LLM_Chat_APP/
├── backend/
│   │── tests/
│   │   └── test_providers.py
│   ├── main.py          # FastAPI app and /chat endpoint
│   ├── models.py        # Pydantic request/response schemas
│   ├── providers.py     # Provider clients (Ollama, OpenAI, Gemini) + shared ask_model function
│   ├── list_models.py   # Utility script to list available models
│   ├── requirements.txt # Python dependencies
│   └── .env.example     # Template for required environment variables
├── frontend/
│   ├── src/              # React source files
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
└── .gitignore


```

## Features

- Single `/chat` endpoint that supports three providers: `ollama`, `openai`, and `gemini`
- Shared `ask_model` function — the calling logic doesn't need to know whether the model is running locally or hosted
- CORS configured for local Vite dev server (`http://localhost:5173`)
- Health check endpoint at `/health`

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy the environment template and fill in your real API keys:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

## Running Backend Tests

The provider tests use a fake client, so they do not contact Ollama or spend hosted API credit:

```bash
cd backend
python3 -m pytest -q
```

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Using Ollama Locally

Make sure [Ollama](https://ollama.com) is installed and running on `http://localhost:11434`, with your desired model pulled (e.g. `ollama pull llama3.1:8b`).

