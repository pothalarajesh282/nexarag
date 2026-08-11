import faiss
import numpy as np


class VectorStore:

    def __init__(self):
        self.index = None
        self.chunks = []

    def create_index(self, embeddings):

        embeddings = np.array(
            embeddings,
            dtype="float32"
        )

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(embeddings)

    def add_chunks(self, chunks):

        self.chunks.extend(chunks)

    def search(self, query_embedding, top_k=3):

        query_embedding = np.array(
            [query_embedding],
            dtype="float32"
        )

        distances, indexes = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for index in indexes[0]:

            if index < len(self.chunks):
                results.append(self.chunks[index])

        return results