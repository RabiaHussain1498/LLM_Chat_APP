import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const MODEL_OPTIONS = {
  ollama: ["llama3.1:8b", "qwen3:8b", "deepseek-r1:8b", "granite4.2:latest", "llama3.1:8b-instruct-fp16 (slow, unquantized)"],
  openai: ["gpt-4o"],
  gemini: ["gemini-3.1-flash-lite"],
};

const PROVIDER_LABELS = { ollama: "Ollama", openai: "OpenAI", gemini: "Gemini" };

function App() {
  const [provider, setProvider] = useState("ollama");
  const [model, setModel] = useState(MODEL_OPTIONS.ollama[0]);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [answeredBy, setAnsweredBy] = useState("ollama");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  function selectProvider(p) {
    setProvider(p);
    setModel(MODEL_OPTIONS[p][0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    setElapsed(0);

    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    const cleanModel = model.split(" ")[0]; // strip the "(slow, unquantized)" label before sending

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider, model: cleanModel }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
      setAnsweredBy(provider);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>LLM Chat App</h1>
      <p className="subtitle">One console | Local and Hosted models side by side.</p>

      <div className="panel">
        <div className="tabs">
          {Object.keys(MODEL_OPTIONS).map((p) => (
            <button
              key={p}
              type="button"
              className={`tab ${provider === p ? "active" : ""}`}
              data-provider={p}
              onClick={() => selectProvider(p)}
            >
              {PROVIDER_LABELS[p]}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {MODEL_OPTIONS[provider].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your prompt..."
              rows={4}
            />
          </div>

          <button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? "Generating…" : "Send"}
          </button>
          {loading && <span className="elapsed">{elapsed}s elapsed</span>}
        </form>

        {error && <div className="error">{error}</div>}

        {response && (
          <div className="readout" data-provider={answeredBy}>
            <div className="label">{PROVIDER_LABELS[answeredBy]} response</div>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;