from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import JournalEntry, User
from app.schemas import JournalCreate, JournalOut, JournalUpdate
from app.routers.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=list[JournalOut])
def list_journals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.created_at.desc()).all()

@router.post("/", response_model=JournalOut)
def create_journal(payload: JournalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    journal = JournalEntry(user_id=current_user.id, **payload.dict())
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal

@router.put("/{journal_id}", response_model=JournalOut)
def update_journal(journal_id: int, payload: JournalUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    journal = db.query(JournalEntry).filter(JournalEntry.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    if journal.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(journal, field, value)
    db.commit()
    db.refresh(journal)
    return journal

@router.delete("/{journal_id}")
def delete_journal(journal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    journal = db.query(JournalEntry).filter(JournalEntry.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    if journal.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    db.delete(journal)
    db.commit()
    return {"status": "ok"}
