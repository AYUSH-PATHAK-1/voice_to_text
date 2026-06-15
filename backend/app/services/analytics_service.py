from app.db.session import SessionLocal
from app.models.action_item import ActionItem
from app.models.analysis import Analysis
from app.models.key_point import KeyPoint
from app.models.meeting import Meeting


class AnalyticsService:

    @staticmethod
    def get_overview():

        db = SessionLocal()

        try:

            total_meetings = (
                db.query(Meeting)
                .count()
            )

            positive_meetings = (
                db.query(Analysis)
                .filter(
                    Analysis.sentiment
                    == "Positive"
                )
                .count()
            )

            neutral_meetings = (
                db.query(Analysis)
                .filter(
                    Analysis.sentiment
                    == "Neutral"
                )
                .count()
            )

            negative_meetings = (
                db.query(Analysis)
                .filter(
                    Analysis.sentiment
                    == "Negative"
                )
                .count()
            )

            return {
                "total_meetings": total_meetings,
                "positive_meetings": positive_meetings,
                "neutral_meetings": neutral_meetings,
                "negative_meetings": negative_meetings
            }

        finally:
            db.close()

    @staticmethod
    def meeting_types():
        db = SessionLocal()
        try:
            meetings = db.query(Analysis).all()
            result = {}

            for meeting in meetings:
              
                meeting_type = meeting.meeting_type or "Unknown"

                # Standard frequency counter logic
                result[meeting_type] = result.get(meeting_type, 0) + 1

            return result
        finally:
            db.close()

    @staticmethod
    def action_items():
      db = SessionLocal()

      try:
          # 1. Total action items is simply the number of rows in the ActionItem table
          total_action_items = db.query(ActionItem).count()

          # 2. To find meetings with action items, count how many distinct 
          # analysis_ids are present in the ActionItem table.
          meetings_with_action_items = (
              db.query(ActionItem.analysis_id)
              .distinct()
              .count()
          )

          return {
              "total_action_items": total_action_items,
              "meetings_with_action_items": meetings_with_action_items
          }

      finally:
          db.close()


    @staticmethod
    def topics():
      db = SessionLocal()

      try:
          # 1. Fetch all raw key point records straight from their table
          key_points = db.query(KeyPoint).all()

          topic_counts = {}

          # 2. Count the frequencies of each topic phrase/point string
          for kp in key_points:
              # Using .point because that is the column name in your KeyPoint model
              topic = kp.point or "General Discussion"
              topic_counts[topic] = topic_counts.get(topic, 0) + 1

          # 3. Sort the topics by popularity (highest count first)
          sorted_topics = dict(
              sorted(
                  topic_counts.items(),
                  key=lambda x: x[1],
                  reverse=True
              )
          )

          return sorted_topics

      finally:
          db.close()


    @staticmethod
    def recent_meetings(limit: int = 10):

      db = SessionLocal()

      try:

          meetings_with_analysis = (
            db.query(Meeting, Analysis)
            .outerjoin(Analysis, Analysis.meeting_id == Meeting.id)
            .order_by(Meeting.id.desc())
            .limit(limit)
            .all()
        )

          result = []

          for meeting, analysis in meetings_with_analysis:

              result.append(
                  {
                      "meeting_id": meeting.id,
                      "filename": meeting.original_filename,
                      "meeting_type": analysis.meeting_type if analysis else "Processing...",
                      "sentiment": analysis.sentiment if analysis else "Processing..."
                  }
              )

          return result

      finally:
          db.close()