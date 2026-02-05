from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import EmailVerificationToken, PasswordResetToken, RefreshToken, User
from app.schemas import (
    EmailVerificationConfirm,
    EmailVerificationRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    TokenPair,
    UserCreate,
    UserOut,
)
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_one_time_token,
    create_refresh_token,
    hash_password,
    verify_password,
)

router = APIRouter()

@router.post("/signup", response_model=UserOut)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=TokenPair)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(db_token)
    db.commit()

    return TokenPair(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    try:
        decoded = jwt.decode(payload.refresh_token, settings.JWT_REFRESH_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if decoded.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        user_id = decoded.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    db_token = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    new_access = create_access_token(str(user_id))
    new_refresh = create_refresh_token(str(user_id))

    db_token.revoked = True
    rotated = RefreshToken(
        user_id=int(user_id),
        token=new_refresh,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(rotated)
    db.commit()

    return TokenPair(access_token=new_access, refresh_token=new_refresh)

@router.post("/logout")
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if db_token:
        db_token.revoked = True
        db.commit()
    return {"status": "ok"}

@router.post("/request-password-reset")
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"status": "ok"}

    token = create_one_time_token()
    db_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1),
    )
    db.add(db_token)
    db.commit()
    return {"status": "ok", "token": token}

@router.post("/reset-password")
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    db_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == payload.token)
        .first()
    )
    if not db_token or db_token.used or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token invalid or expired")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    user.hashed_password = hash_password(payload.new_password)
    db_token.used = True
    db.commit()
    return {"status": "ok"}

@router.post("/request-verification")
def request_verification(payload: EmailVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"status": "ok"}

    token = create_one_time_token()
    db_token = EmailVerificationToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=24),
    )
    db.add(db_token)
    db.commit()
    return {"status": "ok", "token": token}

@router.post("/verify-email")
def verify_email(payload: EmailVerificationConfirm, db: Session = Depends(get_db)):
    db_token = (
        db.query(EmailVerificationToken)
        .filter(EmailVerificationToken.token == payload.token)
        .first()
    )
    if not db_token or db_token.used or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token invalid or expired")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    user.is_email_verified = True
    db_token.used = True
    db.commit()
    return {"status": "ok"}
