import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from backend.app.db.session import SessionLocal
from backend.app.schemas.meeting_analysis import MeetingAnalysis
from backend.app.models.meeting import Meeting
from backend.app.models.analysis import Analysis
from sqlalchemy.orm import joinedload

load_dotenv()


class AnalysisService:

    @staticmethod
    def analyze_transcript(transcript: str):

        api_key = os.getenv("GOOGLE_API_KEY")

        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found")

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0
        )

        structured_llm = llm.with_structured_output(
            MeetingAnalysis
        )

        prompt = f"""
        You are an expert meeting analyst.

        Analyze the meeting transcript and return:

        1. Summary
        2. Key discussion points
        3. Action items
        4. Overall sentiment
        5. Meeting type
        6. Confidence score

        Meeting Types:
        - Sales Call
        - Customer Support
        - Team Meeting
        - Product Discussion
        - Interview
        - Training Session
        - General Discussion

        Sentiment:
        - Positive
        - Neutral
        - Negative

        Confidence Score:
        - Between 0 and 1

        <TRANSCRIPT>

        {transcript}

        </TRANSCRIPT>
        """

        result = structured_llm.invoke(prompt)

        return result

    @staticmethod
    def get_all_meetings(
        page: int,
        limit: int,
        sentiment: str | None,
        meeting_type: str | None,
        search: str | None
    ):

        db = SessionLocal()

        try:

            query = (
                db.query(Meeting)
                .join(Analysis)
                .options(
                    joinedload(Meeting.analysis)
                )
            )

            # Filter by sentiment
            if sentiment:
                query = query.filter(
                    Analysis.sentiment.ilike(sentiment)
                )

            # Filter by meeting type
            if meeting_type:
                query = query.filter(
                    Analysis.meeting_type.ilike(meeting_type)
                )

            # Search by filename
            if search:
                query = query.filter(
                    Meeting.original_filename.ilike(
                        f"%{search}%"
                    )
                )

            total = query.count()

            meetings = (
                query
                .offset((page - 1) * limit)
                .limit(limit)
                .all()
            )

            result = []

            for meeting in meetings:

                result.append(
                    {
                        "id": meeting.id,
                        "original_filename": meeting.original_filename,
                        "sentiment": meeting.analysis.sentiment,
                        "meeting_type": meeting.analysis.meeting_type,
                        "created_at": meeting.created_at,
                    }
                )

            return {
                "total": total,
                "page": page,
                "limit": limit,
                "data": result
            }

        finally:
            db.close()

    @staticmethod
    def get_meeting_by_id(meeting_id: int):

        db = SessionLocal()

        try:

            meeting = (
                db.query(Meeting)
                .filter(Meeting.id == meeting_id)
                .first()
            )

            if not meeting:
                return None

            return {
                "id": meeting.id,
                "original_filename": meeting.original_filename,
                "saved_filename": meeting.saved_filename,
                "created_at": meeting.created_at,

                "transcript": (
                    meeting.transcript.content
                    if meeting.transcript
                    else None
                ),

                "analysis": (
                    {
                        "summary": meeting.analysis.summary,
                        "sentiment": meeting.analysis.sentiment,
                        "meeting_type": meeting.analysis.meeting_type,

                        "key_points": [
                            kp.point
                            for kp in meeting.analysis.key_points
                        ],

                        "action_items": [
                            ai.item
                            for ai in meeting.analysis.action_items
                        ]
                    }
                    if meeting.analysis
                    else None
                )
            }

        finally:
            db.close()