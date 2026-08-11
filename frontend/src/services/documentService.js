import { api } from "./api";

export const getDocuments = async () => {
  const response = await api.get("/api/documents");

  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/api/documents/${documentId}`);

  return response.data;
};
