def split_text(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 200
) -> list[str]:

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size

        chunk = text[start:end]

        if chunk.strip():
            chunks.append(chunk.strip())

        start += chunk_size - overlap

    return chunks