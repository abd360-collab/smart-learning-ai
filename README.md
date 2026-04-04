# 🌟 Smart Learning AI

**Smart Learning AI** is a full-stack AI-powered learning assistant that transforms PDFs into interactive study experiences. Chat with your documents, generate quizzes & flashcards, get summaries, and track your learning progress — all powered by **Google Gemini AI** and built with the **MERN stack**.  

---

## 🔗 Live Application

- **Frontend:** [smart-learning-ai-sigma.vercel.app](https://smart-learning-ai-delta.vercel.app)  
- **Backend API:** [smart-learning-ai-dw4t.onrender.com](https://smart-learning-ai-dw4t.onrender.com)  

---

## 🚀 Key Features

- 💬 Chat with uploaded PDFs for instant Q&A  
- 📝 Auto-generate flashcards & quizzes  
- 📚 Summarize documents intelligently  
- 📈 Track learning progress over time  
- 🔍 Vector semantic search with embeddings  
- 🔒 Secure authentication & persistent chat history  

---

## 🛠 How It Works

Smart Learning AI uses **Retrieval-Augmented Generation (RAG)** with LangChain:  
User Query
->
Text Splitting & Embedding Generation
->
Vector Similarity Search (MongoDB + Embeddings)
->
Context Retrieval from PDFs
->
LLM Response Generation


- Documents are chunked, embedded, and stored as vectors.  
- Queries are matched with chunks using semantic search before generating AI responses.  
- AI generates summaries, flashcards, and quizzes from the same contextual data.  

---

## 🏗 System Architecture
User
->
Frontend (React + Vite + TailwindCSS) [Vercel]
->
Backend API (Node.js + Express) [Render]
->
MongoDB Atlas (Document Storage + Vector Embeddings)


**Persistence:**  

- Database → MongoDB Atlas  
- Uploaded PDFs → Backend storage on Render  

---

## ⚡ Tech Stack

**Frontend**  
- React | Vite | TailwindCSS | Vercel  

**Backend**  
- Node.js | Express | LangChain | Google Gemini AI | MongoDB  

**AI**  
- Gemini LLM models  
- Gemini embeddings  
- LangChain (TextSplitter, Retriever, Vector Embeddings)  

**Infrastructure**  
- Render (Backend hosting)  
- Vercel (Frontend hosting)  

---


---

## 📈 Project Summary

Smart Learning AI combines:  

- AI-powered document retrieval (RAG)  
- Semantic search using vector embeddings  
- PDF-to-interactive learning conversion (chat, quizzes, flashcards, summaries)  
- Cloud-based deployment for production-ready scalability  

This makes it a **complete AI learning assistant**, ready for real users and impressive in interviews.  


