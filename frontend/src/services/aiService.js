import { api } from "./api";

export const askAI = async (question) => {
  const response = await api.post("/api/ai/chat", {
    question,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "AI request failed");
  }

  return response.data;
};
