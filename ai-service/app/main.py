import os
import uuid

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

from app.services.rag_service import process_document
from app.services.chat_service import chat_with_documents
from app.services.document_management_service import ( get_documents,delete_document)


app = FastAPI(
    title="NexaRAG AI Service",
    description="RAG and AI service for NexaRAG",
    version="1.0.0"
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "success": True,
        "message": "NexaRAG AI Service is running"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "ai-service",
        "status": "healthy"
    }


@app.post("/documents/process")
async def process_pdf(
    file: UploadFile = File(...)
):

    document_id = str(uuid.uuid4())

    file_path = (
        f"temp_{document_id}_{file.filename}"
    )

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    try:

        result = process_document(
            file_path=file_path,
            filename=file.filename
        )

        return {
            "success": True,
            "document_id": result["document"]["id"],
            "filename": file.filename,
            "characters": len(result["text"]),
            "chunks": len(result["chunks"]),
            "stored_chunks": len(
                result["stored_chunks"]
            )
        }

    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }

    finally:

        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/chat")
def chat(request: ChatRequest):

    if not request.question.strip():
        return {
            "success": False,
            "message": "Question cannot be empty"
        }

    try:

        result = chat_with_documents(
            question=request.question
        )

        return {
            "success": True,
            "question": request.question,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }

@app.get("/documents")
def documents():

    try:

        result = get_documents()

        return {
            "success": True,
            "documents": result
        }

    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }


@app.delete("/documents/{document_id}")
def remove_document(document_id: str):

    try:

        result = delete_document(document_id)

        return {
            "success": True,
            "message": "Document deleted successfully",
            "document_id": document_id,
            "deleted_chunks": result["deleted_chunks"]
        }

    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }