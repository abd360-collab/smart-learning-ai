import 'dotenv/config';
import mongoose from "mongoose";
import { MistralAIEmbeddings, MistralAI } from "@langchain/mistralai";
import DocumentChunk from "../models/documentChunk.js";

export const askQuestionFromDocument = async (
    documentId,
    userId,
    question
) => {
    try {
        // 1. Create embedding model
        const embeddings = new MistralAIEmbeddings({
            model: "mistral-embed",
            apiKey: process.env.MISTRAL_API_KEY,
        });

        // 2. Embed ONLY the user's question
        const queryVector = await embeddings.embedQuery(question);

        // 3. Convert IDs to ObjectId
        const documentObjectId =
            new mongoose.Types.ObjectId(documentId);

        const userObjectId =
            new mongoose.Types.ObjectId(userId);

        // 4. Retrieve relevant chunks from MongoDB
        const results = await DocumentChunk.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector,
                    numCandidates: 50,
                    limit: 3,
                    filter: {
                        documentId: documentObjectId,
                        userId: userObjectId
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    chunkIndex: 1,
                    pageNumber: 1,
                    score: {
                        $meta: "vectorSearchScore"
                    }
                }
            }
        ]);

        if (results.length === 0) {
            return {
                answer: "Answer not found",
                relevantChunks: []
            };
        }

        // 5. Build context from retrieved chunks
        const context = results
            .map((chunk, index) =>
                `Chunk ${index + 1}:\n${chunk.content}`
            )
            .join("\n\n");

        // 6. Create LLM
        const chat = new MistralAI({
            model: "codestral-latest",
            temperature: 0,
            apiKey: process.env.MISTRAL_API_KEY,
        });

        // 7. Ask LLM using ONLY retrieved context
        const response = await chat.invoke([
            {
                role: "system",
                content:
                    "You are a document question-answering assistant. " +
                    "Answer ONLY using the provided context. " +
                    "If the answer cannot be found in the context, " +
                    "respond with 'Answer not found'."
            },
            {
                role: "user",
                content:
                    `Context:\n${context}\n\n` +
                    `Question:\n${question}`
            }
        ]);

        const parts = response.split(/Answer:/i);
        const finalAnswer =
            (parts.length > 1 ? parts[1] : parts[0]).trim();

        return {
            answer: finalAnswer || "Answer not found",
            relevantChunks: results
        };

    } catch (error) {
        console.error("RAG Error:", error);
        throw error;
    }
};