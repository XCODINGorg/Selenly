from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPair(Token):
    refresh_token: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_email_verified: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationConfirm(BaseModel):
    token: str

class RefreshRequest(BaseModel):
    refresh_token: str

class ProfileBase(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    is_anonymous: bool = True
    goals: Optional[str] = None
    mood_status: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    body: str
    category: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    category: Optional[str] = None

class PostOut(PostBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MoodCreate(BaseModel):
    mood: str
    energy: Optional[str] = None
    note: Optional[str] = None

class MoodOut(MoodCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MoodUpdate(BaseModel):
    mood: Optional[str] = None
    energy: Optional[str] = None
    note: Optional[str] = None

class JournalCreate(BaseModel):
    title: Optional[str] = None
    body: str
    gratitude: Optional[str] = None

class JournalOut(JournalCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    gratitude: Optional[str] = None

class ReportCreate(BaseModel):
    post_id: Optional[int] = None
    reason: str
    details: Optional[str] = None

class ReportOut(ReportCreate):
    id: int
    reporter_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    flagged_crisis: bool = False
