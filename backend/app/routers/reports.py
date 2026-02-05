from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Post, Report, User
from app.schemas import ReportCreate, ReportOut
from app.routers.dependencies import get_current_user, require_admin

router = APIRouter()

@router.post("/", response_model=ReportOut)
def create_report(payload: ReportCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.post_id:
        post = db.query(Post).filter(Post.id == payload.post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

    report = Report(
        reporter_id=current_user.id,
        post_id=payload.post_id,
        reason=payload.reason,
        details=payload.details,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/", response_model=list[ReportOut])
def list_reports(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.put("/{report_id}/status", response_model=ReportOut)
def update_report_status(report_id: int, status: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    db.commit()
    db.refresh(report)
    return report
