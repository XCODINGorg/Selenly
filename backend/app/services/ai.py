from typing import Optional

from openai import OpenAI

from app.core.config import settings

SYSTEM_PROMPT = (
    "You are Selenly, a supportive mental health companion. "
    "You are not a licensed therapist and you do not provide medical advice, diagnosis, or treatment. "
    "Be empathetic, validating, and practical. Offer gentle, actionable coping ideas. "
    "If the user mentions crisis, self-harm, or immediate danger, "
    "encourage them to reach out to local emergency services or a trusted person."
)

CRISIS_KEYWORDS = {
    "suicide",
    "kill myself",
    "end my life",
    "self harm",
    "self-harm",
    "hurt myself",
    "want to die",
    "overdose",
    "no reason to live",
}


def detect_crisis(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in CRISIS_KEYWORDS)


def build_prompt(history, message: str):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for item in history:
        messages.append({"role": item.role, "content": item.content})
    messages.append({"role": "user", "content": message})
    return messages


def get_client():
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def extract_response_text(response) -> str:
    if hasattr(response, "output_text") and response.output_text:
        return response.output_text
    if hasattr(response, "output"):
        parts = []
        for item in response.output:
            if getattr(item, "type", None) == "message":
                for content in item.content:
                    if getattr(content, "type", None) == "output_text":
                        parts.append(content.text)
        if parts:
            return "\n".join(parts)
    return "I'm here with you. Would you like to share more about what's going on?"


def generate_response(message: str, history):
    client = get_client()
    prompt = build_prompt(history, message)

    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        input=prompt,
        temperature=0.7,
    )

    return extract_response_text(response)
