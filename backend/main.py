from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest, ChatResponse
from providers import get_ollama_client, get_openai_client, ask_model, call_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default dev port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        if req.provider == "ollama":
            client = get_ollama_client()
            text = ask_model(client, req.model, req.prompt)
        elif req.provider == "openai":
            client = get_openai_client()
            text = ask_model(client, req.model, req.prompt)
        elif req.provider == "gemini":
            text = await call_gemini(req.prompt, req.model)
        else:
            raise HTTPException(status_code=400, detail="Unknown provider")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Model call failed: {e}")

    return ChatResponse(response=text, provider=req.provider, model=req.model)
