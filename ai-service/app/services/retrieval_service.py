from app.database.supabase_client import supabase


def search_similar_chunks(
    query_embedding: list[float],
    match_threshold: float = 0.5,
    match_count: int = 5
):
    response = (
        supabase
        .rpc(
            "match_document_chunks",
            {
                "query_embedding": query_embedding,
                "match_threshold": match_threshold,
                "match_count": match_count
            }
        )
        .execute()
    )

    return response.data