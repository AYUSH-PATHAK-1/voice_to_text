# 🧠 AI Meeting Intelligence

**Voice-to-text meeting intelligence platform** that converts uploaded meeting audio into transcripts, AI summaries, action items, sentiment signals, semantic search results, and natural-language insights.

> 🔒 This README intentionally excludes API keys, credentials, database URLs, Firebase secrets, and personal data. Use placeholders or environment variables only.

---

## 📌 Project Overview

AI Meeting Intelligence is a full-stack application built with a **FastAPI** backend and a **Next.js** frontend. It helps users upload meeting recordings, automatically transcribe them, analyze the content with AI, store embeddings for semantic retrieval, and explore meeting intelligence through a polished dashboard.

The platform is designed for:

- 🎙️ Meeting transcription
- 📝 Executive summaries and key takeaways
- ✅ Action item extraction
- 😊 Sentiment and meeting-type classification
- 🔎 Semantic search across meeting content
- 💬 AI chat over individual meetings or the full meeting archive
- 📊 Analytics dashboards for meeting trends

---

## ✨ Features

| Area             | Feature                     | Description                                                                                                             |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 🎙️ Upload        | Audio upload                | Upload `.mp3` or `.wav` meeting recordings through the web interface.                                                   |
| ⚙️ Processing    | Background job pipeline     | Upload creates a processing job and runs transcription, analysis, chunking, and embedding generation in the background. |
| 📄 Transcription | Speech-to-text              | Uses Groq audio transcription to convert meeting audio into text.                                                       |
| 🧾 Analysis      | Structured meeting analysis | Extracts summary, key points, action items, sentiment, meeting type, and confidence score.                              |
| 🔎 Search        | Semantic search             | Finds relevant transcript chunks using vector embeddings and PostgreSQL `pgvector`.                                     |
| 💬 Chat          | Meeting assistant           | Ask questions about a single meeting or the full meeting archive.                                                       |
| 📊 Analytics     | Intelligence dashboards     | View sentiment distribution, meeting-type distribution, action items, topics, and recent meetings.                      |
| 🔐 Auth          | Firebase login              | Frontend authentication is handled through Firebase and guarded client-side routes.                                     |
| 🎨 UI            | Modern dashboard            | Responsive Next.js interface with shadcn/ui, Tailwind CSS, Framer Motion, and Lucide icons.                             |

---

## 🧱 Technology Stack

### Backend

| Technology            | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| Python 3.12           | Runtime version used by the project.              |
| FastAPI               | REST API and WebSocket server.                    |
| Uvicorn               | ASGI server for running the backend.              |
| SQLAlchemy            | ORM and database session management.              |
| PostgreSQL + pgvector | Relational storage and vector similarity search.  |
| Groq                  | Audio transcription with Whisper-based models.    |
| Google Gemini         | Meeting analysis, embeddings, chat, and insights. |
| LangChain             | LLM orchestration and structured outputs.         |
| Pydantic              | Request and response schemas.                     |
| python-dotenv         | Environment variable loading.                     |

### Frontend

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Next.js 16           | React application framework.     |
| React 19             | UI runtime.                      |
| TypeScript           | Type-safe frontend development.  |
| Tailwind CSS         | Styling system.                  |
| shadcn/ui + Radix UI | Accessible component primitives. |
| Framer Motion        | Dashboard animations.            |
| Lucide React         | Icon set.                        |
| Firebase Auth        | Google-based authentication.     |
| Axios / Fetch API    | Backend API communication.       |

---

## 🗂️ Project Structure

| Path                       | Description                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `backend/app/`             | FastAPI application, routers, services, schemas, models, and workers.                                    |
| `backend/app/api/`         | API route definitions for upload, meetings, search, chat, insights, jobs, analytics, and WebSockets.     |
| `backend/app/services/`    | Business logic for transcription, analysis, search, embeddings, chat, insights, analytics, and chunking. |
| `backend/app/models/`      | SQLAlchemy database models.                                                                              |
| `backend/app/schemas/`     | Pydantic request and response schemas.                                                                   |
| `backend/app/workers/`     | Background meeting processing worker.                                                                    |
| `frontend/src/app/`        | Next.js app routes and pages.                                                                            |
| `frontend/src/components/` | Reusable UI components and dashboard layout.                                                             |
| `frontend/src/lib/`        | API helpers, analytics helpers, WebSocket helper, and utility functions.                                 |
| `frontend/firebase/`       | Firebase app and auth configuration.                                                                     |
| `README.md`                | Project documentation.                                                                                   |

---

## 🏗️ Architecture

```text
User Browser
   │
   ├── Firebase Auth
   │
   ├── Next.js Frontend
   │      │
   │      ├── Dashboard / Upload / Meetings / Search / Chat / Insights / Analytics
   │      │
   │      └── REST API calls + WebSocket job updates
   │
   └── FastAPI Backend
          │
          ├── Upload API
          ├── Meeting Processing Worker
          ├── Transcription Service
          ├── Analysis Service
          ├── Embedding Service
          ├── Semantic Search Service
          ├── Chat / Insight Services
          └── PostgreSQL + pgvector
```

---

## 🔬 Methodology

The meeting intelligence pipeline follows this flow:

1. **Audio Upload**
   - User uploads an `.mp3` or `.wav` file from the frontend.
   - The backend saves the file temporarily and creates a placeholder meeting record.
   - A processing job is created with `pending` status.

2. **Background Processing**
   - A background thread starts the meeting worker.
   - The job status changes to `processing`.
   - The worker emits status updates through the `/ws/{job_id}` WebSocket endpoint.

3. **Transcription**
   - The audio file is sent to the Groq transcription service.
   - The returned transcript text is stored with the meeting.

4. **Meeting Analysis**
   - The transcript is passed to Google Gemini through LangChain.
   - The model returns structured analysis:
     - Summary
     - Key points
     - Action items
     - Sentiment
     - Meeting type
     - Confidence score

5. **Chunking**
   - The transcript is split into smaller chunks using `RecursiveCharacterTextSplitter`.
   - Chunk size and overlap are configured in the backend chunking service.

6. **Embedding Generation**
   - Each chunk is embedded with Google Gemini embeddings.
   - Embeddings are stored as `pgvector` vectors in PostgreSQL.

7. **Semantic Retrieval**
   - Search queries are embedded.
   - PostgreSQL `pgvector` performs similarity search over meeting chunks.

8. **AI Chat and Insights**
   - Relevant chunks are retrieved and injected into prompts.
   - The LLM generates answers, insights, recommendations, and source references.

---

## 📦 Installation

### Prerequisites

| Requirement        | Recommended Version                             |
| ------------------ | ----------------------------------------------- |
| Python             | 3.12                                            |
| Node.js            | 20+                                             |
| PostgreSQL         | 14+                                             |
| pgvector extension | Enabled in PostgreSQL                           |
| Groq API access    | Required for transcription                      |
| Google API access  | Required for Gemini embeddings and LLM features |
| Firebase project   | Required for authentication                     |

---

## ⚙️ Environment Configuration

Create environment files locally. Never commit real secrets.

### Backend `.env`

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>:<port>/<database>
GROQ_API_KEY=<your_groq_api_key>
GOOGLE_API_KEY=<your_google_api_key>
```

### Frontend `.env.local`

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<firebase_auth_domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<firebase_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<firebase_storage_bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<firebase_messaging_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase_app_id>
```

> 🔒 Store all real values in local environment files only. Do not paste secrets into this README, source code, issues, or pull requests.

---

## 🚀 Usage

### 1. Start the Backend

Open a terminal in the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API should start at:

```text
http://localhost:8000
```

FastAPI docs are available at:

```text
http://localhost:8000/docs
```

### 2. Start the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend should start at:

```text
http://localhost:3000
```

### 3. Use the Application

1. Open the frontend in your browser.
2. Sign in with an authorized Firebase account.
3. Navigate to the upload page.
4. Upload an `.mp3` or `.wav` meeting recording.
5. Wait for the background job to complete.
6. Open the meeting detail page to review:
   - Transcript
   - Summary
   - Key points
   - Action items
   - Sentiment
   - Meeting type
   - Meeting-specific chat

---

## 🌐 Frontend Routes

| Route            | Purpose                                                   |
| ---------------- | --------------------------------------------------------- |
| `/login`         | Firebase sign-in page.                                    |
| `/`              | Main dashboard with analytics cards and feature overview. |
| `/upload`        | Audio upload and processing status page.                  |
| `/meetings`      | Meeting list with filters and search.                     |
| `/meetings/[id]` | Meeting detail page with transcript, analysis, and chat.  |
| `/chat`          | Global AI chat and semantic knowledge-base search.        |
| `/insights`      | Natural-language insight generation page.                 |
| `/analytics`     | Aggregated meeting analytics dashboard.                   |

---

## 🛠️ API Endpoints

| Method | Endpoint                     | Description                                                                   |
| ------ | ---------------------------- | ----------------------------------------------------------------------------- |
| `GET`  | `/`                          | Health check. Returns API running status.                                     |
| `POST` | `/upload`                    | Upload an `.mp3` or `.wav` file and create a processing job.                  |
| `GET`  | `/jobs/{job_id}`             | Fetch processing job status.                                                  |
| `GET`  | `/meetings`                  | List meetings with pagination, sentiment, meeting type, and filename filters. |
| `GET`  | `/meetings/{meeting_id}`     | Fetch one meeting with transcript and analysis.                               |
| `POST` | `/search`                    | Perform semantic search over stored meeting chunks.                           |
| `POST` | `/chat/global`               | Ask a question across all meeting embeddings.                                 |
| `POST` | `/chat/meeting/{meeting_id}` | Ask a question within one meeting.                                            |
| `POST` | `/insights`                  | Generate cross-meeting insights from natural-language questions.              |
| `GET`  | `/analytics/overview`        | Fetch sentiment overview counts.                                              |
| `GET`  | `/analytics/meeting-types`   | Fetch meeting-type distribution.                                              |
| `GET`  | `/analytics/action-items`    | Fetch action-item statistics.                                                 |
| `GET`  | `/analytics/topics`          | Fetch recurring topic counts.                                                 |
| `GET`  | `/analytics/recent-meetings` | Fetch recent meeting summaries.                                               |
| `WS`   | `/ws/{job_id}`               | Receive real-time job status updates.                                         |

---

## 🧬 Data Model

| Model           | Purpose                                                                               |
| --------------- | ------------------------------------------------------------------------------------- |
| `Meeting`       | Stores uploaded audio metadata and creation timestamp.                                |
| `Transcript`    | Stores full transcript text for a meeting.                                            |
| `Analysis`      | Stores summary, sentiment, meeting type, and relationship to key points/action items. |
| `KeyPoint`      | Stores extracted key discussion points.                                               |
| `ActionItem`    | Stores extracted action items.                                                        |
| `MeetingChunk`  | Stores transcript chunks and vector embeddings.                                       |
| `ProcessingJob` | Tracks asynchronous processing status and errors.                                     |
| `ChatHistory`   | Stores meeting-specific chat history.                                                 |

---

## 🔐 Security and Privacy Notes

- Do not commit `.env`, `.env.local`, virtual environments, build output, or uploaded audio files.
- Do not include API keys, Firebase secrets, database credentials, access tokens, or personal data in documentation.
- Firebase configuration values exposed to the browser should be protected with Firebase Authentication and appropriate Firebase security rules.
- The frontend currently uses an authorized-email allowlist for access control. For production, move authorization checks to a trusted backend service.
- The backend CORS settings are suitable for development. Review and restrict allowed origins before deploying publicly.
- Treat uploaded meeting audio and transcripts as sensitive business or personal data.

Recommended sensitive files and directories to keep out of version control:

```text
.env
.env.local
.venv/
frontend/.next/
node_modules/
backend/uploads/
```

---

## 🧪 Development Notes

- The backend initializes database tables on startup using `init_db()`.
- PostgreSQL must have the `pgvector` extension enabled before vector storage and similarity search can work.
- The current worker uses an in-process background thread. For production, consider a durable queue such as Celery, RQ, Dramatiq, or a managed background job service.
- Uploaded audio files are deleted after processing where possible. Production deployments should also consider secure temporary storage and cleanup policies.

---

## 🐛 Troubleshooting

| Issue                            | Possible Cause                                                                   | Suggested Fix                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Backend cannot import `app.main` | Terminal is not in the `backend` directory.                                      | Run Uvicorn from `backend/` or configure `PYTHONPATH`.                          |
| Database connection fails        | `DATABASE_URL` is missing or incorrect.                                          | Create `backend/.env` with a valid PostgreSQL URL.                              |
| Vector search fails              | `pgvector` extension is not enabled.                                             | Enable the extension in PostgreSQL.                                             |
| Uploads fail                     | Backend server is not running or `NEXT_PUBLIC_API_URL` points to the wrong port. | Start the backend on port `8000` and set `NEXT_PUBLIC_API_URL`.                 |
| Login redirects unexpectedly     | Firebase config is missing or user is not authorized.                            | Configure `frontend/.env.local` and update the authorized-user policy securely. |
| Job remains pending              | Background worker failed or server process ended.                                | Check backend logs and ensure API dependencies are installed.                   |

---

## 🤝 Contributing

Contributions are welcome. Please follow these guidelines:

1. Create a new branch for your change.
2. Keep changes focused and well tested.
3. Do not add secrets, credentials, access tokens, or personal data.
4. Do not commit uploaded audio files or generated build artifacts.
5. Update documentation when adding routes, environment variables, or major behavior changes.
6. Run backend and frontend checks before opening a pull request.
7. Keep API responses backward compatible where possible.

Suggested contribution workflow:

```powershell
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
```

---

## 📄 License

MIT
