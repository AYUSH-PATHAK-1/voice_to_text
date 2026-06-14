from groq import Groq
from dotenv import load_dotenv
import os
from pathlib import Path


env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(env_path)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class TranscriptionService:

    @staticmethod
    def transcribe(audio_path: str):

        with open(audio_path, "rb") as file:

            transcription = client.audio.transcriptions.create(
                file=file,
                model="whisper-large-v3-turbo"
            )

        return transcription.text