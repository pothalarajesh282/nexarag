import pymupdf


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    """

    document = pymupdf.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text