from app.database.supabase_client import supabase


def get_documents():
    response = (
        supabase.table("documents").select("*").order("created_at", desc=True).execute()
    )

    return response.data


def delete_document(document_id: str):

    # Delete chunks first
    chunks_response = (
        supabase.table("document_chunks")
        .delete()
        .eq("document_id", document_id)
        .execute()
    )

    # Delete document
    document_response = (
        supabase.table("documents").delete().eq("id", document_id).execute()
    )

    return {
        "document": document_response.data,
        "deleted_chunks": len(chunks_response.data or []),
    }
