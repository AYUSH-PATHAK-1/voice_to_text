# from app.db.session import SessionLocal

# from app.models.meeting import Meeting
# from app.models.transcript import Transcript
# from app.models.analysis import Analysis
# from app.models.key_point import KeyPoint
# from app.models.action_item import ActionItem
# from app.models.meeting_chunk import MeetingChunk
# from app.services.chunking_service import ChunkingService
# from app.services.embedding_service import EmbeddingService


# class MeetingService:

#     @staticmethod
#     def save_meeting(
#         original_filename: str,
#         saved_filename: str,
#         transcript_text: str,
#         analysis_data
#     ):

#         db = SessionLocal()

#         try:

#             meeting = Meeting(
#                 original_filename=original_filename,
#                 saved_filename=saved_filename
#             )

#             db.add(meeting)
#             db.commit()
#             db.refresh(meeting)

#             transcript = Transcript(
#                 meeting_id=meeting.id,
#                 content=transcript_text
#             )

#             db.add(transcript)

#             analysis = Analysis(
#                 meeting_id=meeting.id,
#                 summary=analysis_data.summary,
#                 sentiment=analysis_data.sentiment,
#                 meeting_type=analysis_data.meeting_type
#             )

#             db.add(analysis)

#             db.commit()

#             chunks = ChunkingService.chunk_text(
#             transcript_text
#         )

#         for index, chunk in enumerate(chunks):

#             embedding = (
#                 EmbeddingService.generate_embedding(
#                     chunk
#                 )
#             )

#             db.add(
#                 MeetingChunk(
#                     meeting_id=meeting.id,
#                     chunk_index=index,
#                     chunk_text=chunk,
#                     embedding=embedding
#                 )
#             )

#         db.commit()
#             db.refresh(analysis)

#             for point in analysis_data.key_points:

#                 db.add(
#                     KeyPoint(
#                         analysis_id=analysis.id,
#                         point=point
#                     )
#                 )

#             for item in analysis_data.action_items:

#                 db.add(
#                     ActionItem(
#                         analysis_id=analysis.id,
#                         item=item
#                     )
#                 )

#             db.commit()

#             return meeting.id

#         finally:
#             db.close()



from app.db.session import SessionLocal
from app.models.meeting import Meeting
from app.models.transcript import Transcript
from app.models.analysis import Analysis
from app.models.key_point import KeyPoint
from app.models.action_item import ActionItem

class MeetingService:

    @staticmethod
    def create_placeholder_meeting(original_filename: str, saved_filename: str, db) -> Meeting:
        """Creates a minimal meeting row instantly upon file upload."""
        meeting = Meeting(
            original_filename=original_filename,
            saved_filename=saved_filename
        )
        db.add(meeting)
        db.commit()
        db.refresh(meeting)
        return meeting

    @staticmethod
    def update_processed_meeting(meeting_id: int, transcript_text: str, analysis_data, db):
        """Saves all transcriptions, analysis records, and key points in the background."""
        # 1. Add transcript data
        transcript = Transcript(
            meeting_id=meeting_id,
            content=transcript_text
        )
        db.add(transcript)

        # 2. Add AI analysis details
        analysis = Analysis(
            meeting_id=meeting_id,
            summary=analysis_data.summary,
            sentiment=analysis_data.sentiment,
            meeting_type=analysis_data.meeting_type
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # 3. Add key points
        for point in analysis_data.key_points:
            db.add(KeyPoint(analysis_id=analysis.id, point=point))

        # 4. Add action items
        for item in analysis_data.action_items:
            db.add(ActionItem(analysis_id=analysis.id, item=item))

        db.commit()