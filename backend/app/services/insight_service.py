from backend.app.services.search_service import SearchService
from backend.app.services.llm_service import llm
from backend.app.schemas.InsightOutput import InsightOutput


class InsightService:

    @staticmethod
    def generate_insight(
        question: str
    ):

        chunks = (
            SearchService.semantic_search(
                question,
                limit=10
            )
        )

        context = "\n\n".join(
            chunk["chunk_text"]
            for chunk in chunks
        )

        prompt = f"""
You are a Meeting Intelligence Analyst.

Analyze the provided meeting context.

Question:
{question}

Context:
{context}

Return:

- main_insight
- top_topics
- recommendations
- confidence_score
- meeting_count
- overall_sentiment

Rules:
- top_topics should contain 3 to 5 topics
- recommendations should contain actionable items
- confidence_score should be between 0 and 100
- count the meeting which you get info
- analyze the sentiment by your self
"""

        structured_llm = llm.with_structured_output(
                  InsightOutput
                  )
        response = structured_llm.invoke(
            prompt
        )
        return {
          "main_insight": response.main_insight,
          "top_topics": response.top_topics,
          "recommendations": response.recommendations,
          "confidence_score": response.confidence_score,
          "meeting_count":response.meeting_count,
          "overall_sentiment":response.overall_sentiment,
          "sources": chunks
          }