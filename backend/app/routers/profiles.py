from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Profile, User
from app.schemas import ProfileCreate, ProfileOut
from app.routers.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=ProfileOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=ProfileOut)
def upsert_profile(payload: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        for field, value in payload.dict().items():
            setattr(profile, field, value)
    else:
        profile = Profile(user_id=current_user.id, **payload.dict())
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
