import os
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import User


def promote(email: str) -> None:
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise SystemExit(f"User not found: {email}")
        user.is_admin = True
        db.commit()
        print(f"Promoted {email} to admin")
    finally:
        db.close()


if __name__ == "__main__":
    email = os.getenv("ADMIN_EMAIL")
    if not email:
        raise SystemExit("Set ADMIN_EMAIL environment variable")
    promote(email)
