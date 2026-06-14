# from backend.app.db.session import SessionLocal
# from backend.app.models.processing_job import ProcessingJob
# from backend.app.services.analysis_service import AnalysisService
# from backend.app.services.transcription_service import TranscriptionService
# from backend.app.services.meeting_service import MeetingService
# from backend.app.services.embedding_service import EmbeddingService
# from backend.app.services.chunking_service import ChunkingService
# from backend.app.models.meeting_chunk import MeetingChunk


# def process_meeting(job_id: int, file_path: str, meeting_id: int,original_filename: str, saved_filename: str):

#     db = SessionLocal()

#     job = db.query(ProcessingJob).filter_by(id=job_id).first()

#     try:
#         job.status = "processing"
#         db.commit()

#         # 1. Transcription
#         transcript_text = TranscriptionService.transcribe(file_path)

#         # 2. Analysis
#         analysis_data = AnalysisService.analyze_transcript(transcript_text)

#         # 3. Update meeting
#         MeetingService.update_processed_meeting(
#             meeting_id=meeting_id,
#             transcript_text=transcript_text,
#             analysis_data=analysis_data,
#             db=db
#         )

#         # 4. Chunk + embedding
#         chunks = ChunkingService.chunk_text(transcript_text)

#         for i, chunk in enumerate(chunks):
#             embedding = EmbeddingService.generate_embedding(chunk)

#             db.add(MeetingChunk(
#                 meeting_id=meeting_id,
#                 chunk_index=i,
#                 chunk_text=chunk,
#                 embedding=embedding
#             ))

#         db.commit()

#         job.status = "completed"
#         db.commit()

#     except Exception as e:
#         job.status = "failed"
#         job.error = str(e)
#         db.commit()

#     finally:
#         db.close()


import asyncio

from backend.app.db.session import SessionLocal
from backend.app.models.processing_job import ProcessingJob
from backend.app.services.analysis_service import AnalysisService
from backend.app.services.transcription_service import TranscriptionService
from backend.app.services.meeting_service import MeetingService
from backend.app.services.embedding_service import EmbeddingService
from backend.app.services.chunking_service import ChunkingService
from backend.app.models.meeting_chunk import MeetingChunk
from backend.app.services.websocket_manager import WebSocketManager


# -----------------------------
# SAFE WEBSOCKET SENDER
# -----------------------------
def safe_send(job_id: str, message: dict):
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(
            WebSocketManager.send(job_id, message)
        )

        loop.close()

    except Exception as e:
        print("⚠️ WebSocket Error:", e)


# -----------------------------
# MAIN WORKER FUNCTION
# -----------------------------
def process_meeting(
    job_id: int,
    file_path: str,
    meeting_id: int,
    original_filename: str = None,
    saved_filename: str = None
):

    db = SessionLocal()

    job = db.query(ProcessingJob).filter_by(id=job_id).first()

    try:

        print("👉 JOB STARTED:", job_id)

        # -------------------
        # PROCESSING START
        # -------------------
        job.status = "processing"
        db.commit()

        safe_send(
            str(job_id),
            {"status": "processing"}
        )

        # -------------------
        # TRANSCRIPTION
        # -------------------
        transcript_text = TranscriptionService.transcribe(file_path)

        # -------------------
        # ANALYSIS
        # -------------------
        analysis_data = AnalysisService.analyze_transcript(transcript_text)

        # -------------------
        # UPDATE MEETING
        # -------------------
        MeetingService.update_processed_meeting(
            meeting_id=meeting_id,
            transcript_text=transcript_text,
            analysis_data=analysis_data,
            db=db
        )

        # -------------------
        # CHUNKING + EMBEDDINGS
        # -------------------
        chunks = ChunkingService.chunk_text(transcript_text)

        for i, chunk in enumerate(chunks):
            embedding = EmbeddingService.generate_embedding(chunk)

            db.add(
                MeetingChunk(
                    meeting_id=meeting_id,
                    chunk_index=i,
                    chunk_text=chunk,
                    embedding=embedding
                )
            )

        db.commit()

        print("👉 PROCESSING DONE")

        # -------------------
        # COMPLETED
        # -------------------
        job.status = "completed"
        db.commit()

        safe_send(
            str(job_id),
            {
                "status": "completed",
                "meeting_id": meeting_id
            }
        )

        print("👉 WEBSOCKET SENT: COMPLETED")

    except Exception as e:

        print("❌ ERROR:", e)

        job.status = "failed"
        job.error = str(e)
        db.commit()

        safe_send(
            str(job_id),
            {
                "status": "failed",
                "error": str(e)
            }
        )

    finally:
        db.close()