from fastapi import APIRouter, HTTPException

from app.schemas import ChatRequest, ChatResponse
from app.services.ai import detect_crisis, generate_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    if detect_crisis(payload.message):
        return ChatResponse(
            reply=(
                "I'm really sorry you're going through this. You deserve support. "
                "If you're in immediate danger, please contact local emergency services or a trusted person. "
                "If you're able, consider reaching out to a crisis hotline in your area."
            ),
            flagged_crisis=True,
        )

    try:
        response = generate_response(payload.message, payload.history)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return ChatResponse(reply=response)
