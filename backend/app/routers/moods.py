from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import MoodEntry, User
from app.schemas import MoodCreate, MoodOut, MoodUpdate
from app.routers.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=list[MoodOut])
def list_moods(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id).order_by(MoodEntry.created_at.desc()).all()

@router.post("/", response_model=MoodOut)
def create_mood(payload: MoodCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mood = MoodEntry(user_id=current_user.id, **payload.dict())
    db.add(mood)
    db.commit()
    db.refresh(mood)
    return mood

@router.put("/{mood_id}", response_model=MoodOut)
def update_mood(mood_id: int, payload: MoodUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mood = db.query(MoodEntry).filter(MoodEntry.id == mood_id).first()
    if not mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    if mood.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(mood, field, value)
    db.commit()
    db.refresh(mood)
    return mood

@router.delete("/{mood_id}")
def delete_mood(mood_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mood = db.query(MoodEntry).filter(MoodEntry.id == mood_id).first()
    if not mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    if mood.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    db.delete(mood)
    db.commit()
    return {"status": "ok"}
