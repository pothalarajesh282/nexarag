from app.services.document_service import extract_text_from_pdf
from app.rag.chunking import split_text
from app.rag.embeddings import create_embeddings
from app.services.storage_service import (
    create_document,
    create_chunks
)


def process_document(
    file_path: str,
    filename: str
):
    """
    Process a PDF and store its chunks + embeddings.
    """

    # 1. Extract text from PDF
    text = extract_text_from_pdf(file_path)

    if not text.strip():
        raise ValueError(
            "No text found in PDF"
        )

    # 2. Split text into chunks
    chunks = split_text(text)

    if not chunks:
        raise ValueError(
            "No chunks created from document"
        )

    # 3. Create document record
    document = create_document(
        filename
    )

    # 4. Create Gemini embeddings
    embeddings = create_embeddings(
        chunks
    )

    # 5. Store chunks + embeddings
    stored_chunks = create_chunks(
        document["id"],
        chunks,
        embeddings
    )

    return {
        "document": document,
        "text": text,
        "chunks": chunks,
        "stored_chunks": stored_chunks
    }