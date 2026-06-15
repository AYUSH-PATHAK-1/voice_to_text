from app.db.session import SessionLocal
from app.models.processing_job import ProcessingJob


class JobService:

    @staticmethod
    def get_job(job_id: str):

        db = SessionLocal()

        try:
            job = db.query(ProcessingJob).filter(
                ProcessingJob.id == job_id
            ).first()

            if not job:
                return None

            return {
                "job_id": job.id,
                "meeting_id": job.meeting_id,
                "status": job.status,
                "error": job.error
            }

        finally:
            db.close()