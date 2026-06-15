from app.db.session import SessionLocal
from sqlalchemy import text
from app.services.embedding_service import EmbeddingService


class SearchService:

    @staticmethod
    def semantic_search(
        query: str,
        limit: int = 5
    ):

        db = SessionLocal()

        try:

            query_embedding = (
                EmbeddingService.generate_embedding(
                    query
                )
            )

            sql = text(
                """
                SELECT
                    id,
                    meeting_id,
                    chunk_text,
                    embedding <=> CAST(:embedding AS vector)
                    AS distance

                FROM meeting_chunks

                ORDER BY embedding <=> CAST(:embedding AS vector)

                LIMIT :limit
                """
            )

            result = db.execute(
                sql,
                {
                    "embedding": str(query_embedding),
                    "limit": limit
                }
            )

            rows = result.fetchall()

            return [
                {
                    "chunk_id": row.id,
                    "meeting_id": row.meeting_id,
                    "chunk_text": row.chunk_text,
                    "distance": row.distance
                }
                for row in rows
            ]

        finally:
            db.close()

    @staticmethod
    def semantic_search_by_meeting(
      query: str,
      meeting_id: int,
      limit: int = 5
  ):

      db = SessionLocal()

      try:

          query_embedding = (
              EmbeddingService.generate_embedding(
                  query
              )
          )

          sql = text("""
              SELECT
                  id,
                  meeting_id,
                  chunk_text,
                  embedding <=> CAST(:embedding AS vector)
                  AS distance

              FROM meeting_chunks

              WHERE meeting_id = :meeting_id

              ORDER BY embedding <=> CAST(:embedding AS vector)

              LIMIT :limit
          """)

          result = db.execute(
              sql,
              {
                  "embedding": str(query_embedding),
                  "meeting_id": meeting_id,
                  "limit": limit
              }
          )

          rows = result.fetchall()

          return [
              {
                  "chunk_id": row.id,
                  "meeting_id": row.meeting_id,
                  "chunk_text": row.chunk_text,
                  "distance": row.distance
              }
              for row in rows
          ]

      finally:
          db.close()      