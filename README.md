Smart Learning AI

Smart Learning AI is a Full-Stack AI Learning Assistant that transforms PDFs into interactive study experiences. Users can chat with their uploaded documents, generate flashcards, quizzes, summaries, and track learning progress — all powered by Google Gemini AI.

Live Application

Frontend
https://smart-learning-ai-sigma.vercel.app

Backend API
https://smart-learning-ai-dw4t.onrender.com

Features
Chat with uploaded PDF documents
Auto-generate flashcards and quizzes from PDFs
Summarize content intelligently
Track learning progress over time
Vector semantic search using embeddings
Persistent chat history
Secure authentication
How It Works

Smart Learning AI uses a Retrieval-Augmented Generation (RAG) pipeline with LangChain:

User Query
  ↓
Text Splitting & Embedding Generation
  ↓
Vector Similarity Search (MongoDB + embeddings)
  ↓
Relevant Context Retrieval
  ↓
LLM Response Generation

PDFs are chunked, embedded, and stored as vectors.
Queries are matched with document chunks using vector similarity search before generating AI responses.
The AI can generate flashcards, summaries, and quizzes from the same contextual data.
System Architecture
User
  ↓
Frontend (Vercel / React)
  ↓
Backend API (Render / Node.js + Express)
  ↓
MongoDB Atlas (Document Storage + Embeddings)

Persistence:

Database → MongoDB Atlas
Uploaded PDFs → Backend storage on Render
Tech Stack

Frontend

React
Vite
TailwindCSS
Vercel

Backend

Node.js
Express
LangChain
Google Gemini AI
MongoDB (Atlas)

AI

Gemini models
Gemini embeddings
LangChain (TextSplitter, Retriever, Vector Embeddings)

Infrastructure

Docker (optional)
Render (Backend hosting)
Vercel (Frontend hosting)
Deployment Architecture
Backend runs on Render with persistent storage for uploaded PDFs.
Frontend is deployed on Vercel for fast CDN access.
Vector embeddings are stored in MongoDB Atlas for scalable semantic search.
CI/CD Pipeline
Push code to GitHub
GitHub Actions (optional) builds backend Docker image
Deploy backend to Render
Frontend auto-deploys via Vercel on commit
Security
Backend API secured with HTTPS
User authentication ensures private access to uploaded documents and learning history
Project Summary

Smart Learning AI combines:

RAG-based AI document retrieval
Vector similarity search
PDF-to-learning conversion (chat, flashcards, quizzes, summaries)
Cloud-based scalable deployment

to create a production-ready AI learning assistant.

About

Smart Learning AI enables students and professionals to convert static PDFs into interactive, AI-driven study experiences.
