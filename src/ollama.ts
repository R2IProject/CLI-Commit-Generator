export interface GenerateCommitMessageOptions {
  host: string;
  model: string;
  prompt: string;
}

interface OllamaGenerateResponse {
  response?: string;
}

export async function generateCommitMessage({
  host,
  model,
  prompt,
}: GenerateCommitMessageOptions): Promise<string> {
  const response = await postGenerateRequest(host, model, prompt);

  if (!response.ok) {
    const detail = await readOllamaError(response);
    throw new Error(`Ollama API error (${response.status} ${response.statusText}): ${detail}`);
  }

  const data = (await response.json()) as OllamaGenerateResponse;
  const message = sanitizeCommitMessage(data.response ?? "");

  if (!message) {
    throw new Error("Ollama returned an empty commit message.");
  }

  return message;
}

async function postGenerateRequest(host: string, model: string, prompt: string): Promise<Response> {
  try {
    return await fetch(`${host}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });
  } catch (error) {
    throw new Error(`Could not connect to Ollama at ${host}: ${formatError(error)}`);
  }
}

async function readOllamaError(response: Response): Promise<string> {
  const fallback = response.statusText || `HTTP ${response.status}`;

  try {
    const body = await response.text();
    if (!body.trim()) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(body) as {
        error?: unknown;
        message?: unknown;
        Status?: unknown;
      };

      if (typeof parsed.error === "string") {
        return parsed.error;
      }
      if (typeof parsed.message === "string") {
        return parsed.message;
      }
      if (typeof parsed.Status === "string") {
        return parsed.Status;
      }
    } catch {
      return body.trim();
    }

    return body.trim();
  } catch {
    return fallback;
  }
}

function sanitizeCommitMessage(value: string): string {
  return value
    .trim()
    .replace(/^```(?:\w+)?/, "")
    .replace(/```$/, "")
    .trim()
    .replace(/^["'`]|["'`]$/g, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";
}

function formatError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = "cause" in error ? error.cause : undefined;
  if (cause instanceof Error) {
    return `${error.message} (${cause.message})`;
  }

  return error.message;
}
