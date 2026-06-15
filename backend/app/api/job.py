from fastapi import APIRouter

from app.services.JobService import JobService

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/{job_id}")
async def get_job_status(job_id: str):

    job = JobService.get_job(job_id)

    if not job:
        return {"error": "Job not found"}

    return job