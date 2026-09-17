import os
from dotenv import load_dotenv
from openai import OpenAI
from google import genai

load_dotenv()

def get_ollama_client() -> OpenAI:
    return OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama",
        timeout=890.0,  
    )

def get_openai_client() -> OpenAI:
    return OpenAI(api_key=os.environ["OPENAI_API_KEY"])


def ask_model(client: OpenAI, model: str, message: str) -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content


async def call_gemini(prompt: str, model: str) -> str:
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    response = client.models.generate_content(model=model, contents=prompt)
    return response.text