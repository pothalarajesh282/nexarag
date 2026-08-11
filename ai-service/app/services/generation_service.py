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


def generate_answer(
    question: str,
    context: str
) -> str:

    prompt = f"""
You are NexaRAG, an AI document assistant.

Your job is to answer the user's question
using ONLY the provided document context.

Rules:
1. Do not invent information.
2. Do not use outside knowledge.
3. If the answer is not present in the context,
   say "I could not find the answer in the uploaded documents."
4. Give a clear and concise answer.

Document Context:
{context}

User Question:
{question}

Answer:
"""

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-lite",
        contents=prompt
    )

    return response.text