from backend.app.services.search_service import SearchService
from backend.app.services.llm_service import llm
from backend.app.models.chat_history import ChatHistory
from backend.app.db.session import SessionLocal



class ChatService:

    @staticmethod
    def chat(question: str):

        chunks = SearchService.semantic_search(
            question,
            limit=3
        )

        context = "\n\n".join(
            chunk["chunk_text"]
            for chunk in chunks
        )

        prompt = f"""
You are an AI meeting assistant.

Use ONLY the provided context.

Context:
{context}

Question:
{question}

Answer clearly and concisely.
"""

        response = llm.invoke(
            prompt
        )

        return {
            "answer": response.content,
            "sources": [
                {
                    "meeting_id": chunk["meeting_id"],
                    "chunk_id": chunk["chunk_id"]
                }
                for chunk in chunks
            ]
        }
    @staticmethod
    def chat_with_meeting(
      meeting_id: int,
      question: str
  ):
      
      # 1. Start the database session to fetch history FIRST
      db = SessionLocal()
        
      try:
            # Fetch last 5 messages for this meeting
            history_records = db.query(ChatHistory).filter(
                ChatHistory.meeting_id == meeting_id
            ).order_by(ChatHistory.created_at.desc()).limit(5).all()

            # Format the history text (reversed so it reads chronologically)
            history_text = "\n".join(
                f"{h.role}: {h.message}"
                for h in reversed(history_records)
            )
      except Exception as e:
            print(f"Error fetching chat history: {e}")
            history_text = "No previous history available."

      chunks = (
          SearchService.semantic_search_by_meeting(
              query=question,
              meeting_id=meeting_id,
              limit=3
          )
      )

      context = "\n\n".join(
          chunk["chunk_text"]
          for chunk in chunks
      )

      prompt = f"""
You are an AI Meeting Assistant.

Conversation History:
{history_text}

Context:
{context}

User Question:
{question}

Answer naturally using both context and history.
"""

      response = llm.invoke(prompt)
      
      # 3. 💾 SAVE TO CHAT HISTORY (Added Here)
      db = SessionLocal()
      try:
            # Store user message
            db.add(
                ChatHistory(
                    meeting_id=meeting_id,
                    role="user",
                    message=question
                )
            )

            # Store assistant response
            db.add(
                ChatHistory(
                    meeting_id=meeting_id,
                    role="assistant",
                    message=response.content
                )
            )

            db.commit()
      except Exception as e:
            db.rollback()  # Rollback if saving fails to prevent database locks
            print(f"Error saving chat history: {e}") 
      finally:
            db.close()     # Always close the session cleanly      

      return {
          "answer": response.content,
          "sources": chunks
      }