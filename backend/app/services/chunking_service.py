# class ChunkingService:

#     @staticmethod
#     def chunk_text(
#         text: str,
#         chunk_size: int = 1000
#     ):

#         chunks = []

#         for i in range(
#             0,
#             len(text),
#             chunk_size
#         ):

#             chunks.append(
#                 text[i:i + chunk_size]
#             )

#         return chunks

from langchain_text_splitters import RecursiveCharacterTextSplitter

class ChunkingService:

    @staticmethod
    def chunk_text(text: str):

        splitter = (
            RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
        )

        return splitter.split_text(text)