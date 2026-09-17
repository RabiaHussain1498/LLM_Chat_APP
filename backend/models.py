from pydantic import BaseModel
from typing import Literal



class ChatRequest(BaseModel):
    prompt: str
    provider: Literal["ollama","openai", "gemini"]
    model: str  # e.g. "llama3.1:8b", "claude-sonnet-4-6", "gpt-4o"

class ChatResponse(BaseModel):
    response: str
    provider: str
    model: str

