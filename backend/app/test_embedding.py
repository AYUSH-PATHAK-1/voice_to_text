import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

result = client.models.embed_content(
    model="models/gemini-embedding-001",
    contents=["Hello world"]
)

embedding = result.embeddings[0].values

print(len(embedding))
print(embedding[:5])