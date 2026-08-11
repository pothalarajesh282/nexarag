from app.rag.embeddings import create_embeddings
from app.services.retrieval_service import search_similar_chunks
from app.services.generation_service import generate_answer


def chat_with_documents(
    question: str,
    match_threshold: float = 0.5,
    match_count: int = 5
):
    # 1. Convert question into an embedding
    embeddings = create_embeddings([question])

    question_embedding = embeddings[0]

    # 2. Search Supabase for relevant chunks
    results = search_similar_chunks(
        query_embedding=question_embedding,
        match_threshold=match_threshold,
        match_count=match_count
    )

    # 3. Make sure we found something
    if not results:
        return {
            "answer": (
                "I could not find the answer "
                "in the uploaded documents."
            ),
            "sources": []
        }

    # 4. Build context for Gemini
    context_parts = []

    for result in results:
        context_parts.append(
            result["content"]
        )

    context = "\n\n".join(context_parts)

    # 5. Generate the final answer
    answer = generate_answer(
        question=question,
        context=context
    )

    # 6. Return answer + retrieval information
    sources = []

    for result in results:
        sources.append({
            "document_id": result["document_id"],
            "chunk_id": result["id"],
            "similarity": result["similarity"],
            "content": result["content"]
        })

    return {
        "answer": answer,
        "sources": sources
    }