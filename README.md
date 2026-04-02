🤖 Smart Learning AI Assistant
A powerful Full-Stack MERN application that transforms static PDFs into interactive, AI-driven study experiences. Leveraging Google Gemini AI and LangChain, the platform allows users to chat with their documents, generate quizzes, and track their learning progress in real-time.

🚀 Live Demo: Frontend on Vercel

🌐 Backend API: Deployed on Render

✨ Features
📄 PDF-to-Knowledge Transformation: Upload PDFs and process them using LangChain for deep document understanding.

💬 Context-Aware AI Chat: Chat with your documents using RAG (Retrieval-Augmented Generation) to get precise answers with references.

🧠 Automated Study Tools: * Quizzes: Auto-generate questions based on your specific PDF content.

Flashcards: Summarize key concepts into digestible cards.

Summaries: Get instant high-level overviews of long documents.

📈 Progress Tracking: Monitor your learning journey and quiz scores.

🎨 Modern UI: A responsive, sleek interface built with React and Tailwind CSS.

🛠️ Tech Stack
Frontend
React.js (Vite)

Tailwind CSS (Styling)

Axios (API Communication)

Context API (State Management)

Backend
Node.js & Express.js

MongoDB (Database with 2dsphere indexing for potential location features)

JWT (Secure Authentication)

AI & Data Processing (GenAI)
Google Gemini AI (LLM)

LangChain (Orchestration)

Text Splitters (Recursive Character Splitting)

Embeddings & Vector Store (Efficient document retrieval)

📂 Project Structure
Plaintext
├── backend/
│   ├── config/         # Database and Environment configs
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth & Error handling
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # LangChain & Gemini Logic
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global state
    │   ├── pages/      # View components
    │   ├── services/   # API calling logic
    │   └── utils/      # apiPaths and axiosInstances
⚙️ Installation & Setup
Clone the repository:

Bash
git clone https://github.com/abd360-collab/smart-learning-ai.git
Backend Setup:

Navigate to /backend.

Install dependencies: npm install.

Create a .env file and add:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_gemini_key
JWT_SECRET=your_secret_key
Start server: npm run dev.

Frontend Setup:

Navigate to /frontend/ai-learning-assistant.

Install dependencies: npm install.

Update src/utils/apiPaths.js to point to your backend.

Start the app: npm run dev.

📝 License
Distributed under the MIT License.

🤝 Contact
Saurabh Chaubey - GitHub

Project Link: https://smart-learning-ai-sigma.vercel.app
