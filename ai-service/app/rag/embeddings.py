import os

from dotenv import load_dotenv
from google import genai


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing")


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def create_embeddings(chunks: list[str]) -> list[list[float]]:
    """
    Create Gemini embeddings for a list of text chunks.
    """

    embeddings = []

    for chunk in chunks:

        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=chunk
        )

        embedding = response.embeddings[0].values

        embeddings.append(embedding)

    return embeddings