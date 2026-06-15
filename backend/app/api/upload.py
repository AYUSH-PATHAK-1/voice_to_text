from fastapi import APIRouter, UploadFile, File, HTTPException
# from app.services.transcription_service import TranscriptionService
# from app.services.analysis_service import AnalysisService
from app.db.session import SessionLocal
from app.services.meeting_service import MeetingService
from app.models.processing_job import ProcessingJob
from app.workers.meeting_worker import process_meeting
from pathlib import Path
import shutil
import uuid
import threading

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".mp3", ".wav"}


# @router.post("/upload")
# async def upload_audio(
#     file: UploadFile = File(...)
# ):
    
#     file_extension = Path(file.filename).suffix.lower()

#     if file_extension not in ALLOWED_EXTENSIONS:
#         raise HTTPException(
#             status_code=400,
#             detail="Only .mp3 and .wav files are allowed"
#         )

#     unique_filename = f"{uuid.uuid4()}{file_extension}"

#     file_path = UPLOAD_DIR / unique_filename

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     transcript = TranscriptionService.transcribe(
#     str(file_path)
# )
    
#     analysis = AnalysisService.analyze_transcript(
#     transcript
# )
    
#     meeting_id = MeetingService.save_meeting(
#     original_filename=file.filename,
#     saved_filename=unique_filename,
#     transcript_text=transcript,
#     analysis_data=analysis
# )

#     return {
#     "meeting_id": meeting_id,
#     "original_filename": file.filename,
#     "saved_filename": unique_filename,
#     "transcript": transcript,
#     "analysis": analysis.model_dump()
# }



@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...)
):

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only .mp3 and .wav files are allowed"
        )

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db = SessionLocal()

    try:
        # 1. Create placeholder meeting first
        meeting = MeetingService.create_placeholder_meeting(
            original_filename=file.filename,
            saved_filename=unique_filename,
            db=db
        )

        # 2. Create job
        job = ProcessingJob(
            meeting_id=meeting.id,
            status="pending"
        )

        db.add(job)
        db.commit()
        db.refresh(job)

        # 3. Trigger background worker
        threading.Thread(
            target=process_meeting,
            args=(job.id, str(file_path), meeting.id, file.filename, unique_filename)
        ).start()

        return {
            "message": "File uploaded successfully",
            "job_id": job.id,
            "meeting_id": meeting.id,
            "status": "pending"
        }

    finally:
        db.close()