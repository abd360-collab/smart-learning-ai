import 'dotenv/config';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings, MistralAI } from "@langchain/mistralai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";

export const askQuestionFromText = async (text, question) => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const docs = await splitter.createDocuments([text]);

    // 2️⃣ Embeddings
    const embeddings = new MistralAIEmbeddings({
      model: "mistral-embed",
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // 3️⃣ Vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // 4️⃣ Retrieve top 3 relevant chunks
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // 5️⃣ Chat model
    const chat = new MistralAI({
      model: "codestral-latest",
      temperature: 0,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // 6️⃣ Ask the model
    const response = await chat.invoke([
      { role: "system", content: "Answer ONLY using the context. If not found, say 'Answer not found'" },
      { role: "user", content: `Context:\n${text}\n\nQuestion:\n${question}` }
    ]);
    
const parts = response.split(/Answer:/i);
const finalAnswer = (parts.length > 1 ? parts[1] : parts[0]).trim();

console.log("--- DEBUG START ---");
console.log("Raw from AI:", response);
console.log("Cleaned Result:", finalAnswer);
console.log("--- DEBUG END ---");

return finalAnswer || "Answer not found";

  } catch (error) {
    console.error("Mistral Error:", error);
    return "Answer not found";
  }
};