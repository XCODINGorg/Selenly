import os
import random
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import SessionLocal
from app.models import JournalEntry, MoodEntry, Post, Profile, User


def seed():
    db: Session = SessionLocal()
    try:
        demo_email = os.getenv("DEMO_EMAIL", "demo@selenly.com")
        demo_password = os.getenv("DEMO_PASSWORD", "DemoPass123!")

        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            user = User(
                email=demo_email,
                hashed_password=hash_password(demo_password),
                is_active=True,
                is_email_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if not profile:
            profile = Profile(
                user_id=user.id,
                display_name="Selenly Demo",
                bio="Exploring gentle routines for steady days.",
                is_anonymous=False,
                goals="Breathing exercises, journaling, and weekly walks.",
                mood_status="Hopeful",
            )
            db.add(profile)

        post_samples = [
            ("Finding calm today", "Tried the 5-minute breathing exercise and it helped.", "Stress"),
            ("Small win", "I reached out to a friend and felt lighter.", "Self-Growth"),
            ("Sleep check-in", "Sharing what helped me fall asleep this week.", "Wellness"),
        ]

        if not db.query(Post).filter(Post.user_id == user.id).first():
            for title, body, category in post_samples:
                db.add(Post(user_id=user.id, title=title, body=body, category=category))

        mood_samples = [
            ("Calm", "Steady", "Meditation helped."),
            ("Reflective", "Low", "Needed quiet time."),
            ("Hopeful", "High", "Great support today."),
        ]

        if not db.query(MoodEntry).filter(MoodEntry.user_id == user.id).first():
            for mood, energy, note in mood_samples:
                db.add(MoodEntry(user_id=user.id, mood=mood, energy=energy, note=note))

        journal_samples = [
            ("Morning reflection", "I felt nervous but took a deep breath before work.", "Grateful for sunshine."),
            ("Evening check", "I honored my boundaries and rested.", "Grateful for calm music."),
        ]

        if not db.query(JournalEntry).filter(JournalEntry.user_id == user.id).first():
            for title, body, gratitude in journal_samples:
                db.add(JournalEntry(user_id=user.id, title=title, body=body, gratitude=gratitude))

        db.commit()
        print(f"Seeded demo data for {demo_email}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
