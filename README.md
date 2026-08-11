# NexaRAG

> AI-powered company knowledge base using Retrieval-Augmented Generation (RAG) to provide grounded answers from uploaded documents.

## Overview

**NexaRAG** is a full-stack AI document intelligence platform designed for organizations to securely manage company documents and ask questions using natural language.

Administrators can upload company PDFs, while employees can query the organization's knowledge base and receive AI-generated answers grounded in the uploaded documents.

The application combines **React, Node.js, FastAPI, Supabase, vector search, and Gemini**.

## Features

### Authentication & Authorization

- Employee registration
- Secure login/logout
- Supabase Authentication
- JWT-based authentication
- Admin and Employee roles
- Protected routes
- Role-based document permissions

### Document Management

- Admin-only PDF upload
- PDF text extraction
- Document chunking
- Vector embedding generation
- Supabase vector storage
- Document listing
- Admin-only document deletion

### AI RAG

- Natural-language document questions
- Retrieval-Augmented Generation
- Semantic/vector search
- Gemini-powered responses
- Grounded answers from company documents
- Source information with AI responses
- Markdown-formatted AI responses

### User Interface

- React dashboard
- Admin dashboard
- Employee dashboard
- Responsive design
- NexaRAG branded loading screen
- AI chat interface
- Quick prompt suggestions
- Markdown rendering
- Document management interface
- Swagger API documentation

## Architecture

```text
                    ┌─────────────────────┐
                    │     React / Vercel  │
                    │                     │
                    │ Admin / Employee UI │
                    └──────────┬──────────┘
                               │
                            JWT Auth
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └───────┬───────┬─────┘
                            │       │
                            │       ▼
                            │  ┌──────────────┐
                            │  │   Supabase   │
                            │  │ Auth + DB    │
                            │  │ + pgvector   │
                            │  └──────────────┘
                            │
                            ▼
                    ┌─────────────────────┐
                    │ FastAPI AI Service  │
                    │                     │
                    │ PDF → Chunk → Embed │
                    │ Vector Search → RAG │
                    └──────────┬──────────┘
                               │
                               ▼
                         ┌───────────┐
                         │  Gemini   │
                         │    AI     │
                         └───────────┘
```

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Lucide React
- React Markdown
- Remark GFM
- CSS

### Backend

- Node.js
- Express.js
- Axios
- CORS
- Swagger / OpenAPI
- JWT authentication

### AI Service

- Python
- FastAPI
- Uvicorn
- PyMuPDF
- RAG pipeline
- Vector search
- Gemini API

### Database & Authentication

- Supabase
- PostgreSQL
- pgvector
- Supabase Authentication
- Row Level Security

### Deployment

- Vercel — React frontend
- Render — Node.js backend
- Render — FastAPI AI service
- Supabase — Database and authentication

## Project Structure

```text
nexarag/
│
├── frontend/
│   ├── public/
│   │   └── nexarag-logo.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── PDFUpload/
│   │   │   ├── Documents/
│   │   │   └── AppLoader/
│   │   │
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── swagger.js
│   ├── index.js
│   └── package.json
│
├── ai-service/
│   ├── app/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Environment Variables

### Frontend

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend

Create:

```text
backend/.env
```

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:8000

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### AI Service

Create:

```text
ai-service/.env
```

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Never commit `.env` files or secret API keys to GitHub.**

## Local Development

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd nexarag
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 3. Start Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Swagger:

```text
http://localhost:5000/api-docs
```

### 4. Start AI Service

Open another terminal:

```bash
cd ai-service
python -m pip install -r requirements.txt
```

Start FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

AI service:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## RAG Workflow

### Document Upload

```text
Admin uploads PDF
        ↓
Node.js
        ↓
FastAPI
        ↓
Extract PDF text
        ↓
Split into chunks
        ↓
Generate embeddings
        ↓
Store chunks + vectors
        ↓
Supabase
```

### Question Answering

```text
Employee asks question
        ↓
React
        ↓
Node.js
        ↓
FastAPI
        ↓
Generate/query embedding
        ↓
Vector similarity search
        ↓
Retrieve relevant chunks
        ↓
Gemini
        ↓
Grounded answer
        ↓
React
```

## API Endpoints

### Health

```http
GET /api/health
```

### AI Chat

```http
POST /api/ai/chat
```

Example:

```json
{
  "question": "What is the work from home policy?"
}
```

### Document Upload

```http
POST /api/documents/upload
```

Requires:

```text
Authorization: Bearer <JWT>
```

Admin access required.

### Documents

```http
GET /api/documents
```

### Delete Document

```http
DELETE /api/documents/:documentId
```

Admin access required.

## Security

NexaRAG uses:

- Supabase Authentication
- JWT authentication
- Role-based authorization
- Protected React routes
- Admin-only document management
- Supabase Row Level Security
- Environment variables for secrets
- Production CORS configuration
- Backend-only service credentials

## Deployment

### Frontend — Vercel

Deploy the `frontend` directory to Vercel.

```text
Build Command:
npm run build

Output Directory:
dist
```

Production environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

For React Router direct routes such as `/login` and `/register`, include:

```text
frontend/vercel.json
```

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Node.js Backend — Render

Deploy the `backend` directory to Render.

```text
Build Command:
npm install
```

```text
Start Command:
npm start
```

Production environment:

```env
AI_SERVICE_URL=https://nexarag.onrender.com
FRONTEND_URL=https://nexarag.vercel.app
```

### FastAPI AI Service — Render

Deploy the `ai-service` directory to Render.

```text
Build Command:
pip install -r requirements.txt
```

```text
Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Version Control

The project uses Git for version control.

### Main Branch

```text
main
```

The `main` branch represents the production version.

### Feature Branches

```text
feature/feature-name
```

Example:

```bash
git checkout -b feature/new-dashboard
git add .
git commit -m "Add new dashboard feature"
git push -u origin feature/new-dashboard
```

### Production Release

```bash
git tag -a v1.0.0 -m "NexaRAG production MVP"
git push origin v1.0.0
```

## Production Architecture

```text
                         NexaRAG
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Vercel Frontend              Supabase
              │                    Auth + Database
              │
              ▼
       Render Backend
              │
              ▼
       Render FastAPI
              │
              ▼
            Gemini
```

## Future Improvements

Potential future enhancements:

- Streaming AI responses
- Document-specific RAG
- Advanced source citations
- Document preview
- User management
- Analytics dashboard
- Audit logs
- Multiple document formats
- Improved semantic search
- Reranking
- Rate limiting

## License

This project is intended for educational, portfolio, and demonstration purposes.