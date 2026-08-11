from app.database.supabase_client import supabase


def create_document(filename: str):
    """
    Create a document record in the documents table.
    """

    response = (
        supabase
        .table("documents")
        .insert({
            "filename": filename
        })
        .execute()
    )

    if not response.data:
        raise ValueError("Failed to create document")

    return response.data[0]


def create_chunks(
    document_id: str,
    chunks: list[str],
    embeddings: list[list[float]]
):
    """
    Store document chunks and their Gemini embeddings
    in the document_chunks table.
    """

    if len(chunks) != len(embeddings):
        raise ValueError(
            "Number of chunks and embeddings must be the same"
        )

    rows = []

    for index, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):

        rows.append({
            "document_id": document_id,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": index
        })

    response = (
        supabase
        .table("document_chunks")
        .insert(rows)
        .execute()
    )

    if not response.data:
        raise ValueError("Failed to store document chunks")

    return response.data