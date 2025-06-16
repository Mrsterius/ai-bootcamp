# 🤖 Agent Engineering Bootcamp Project

A full-stack AI-powered application with Python backend and React/TypeScript frontend.

## 🏗️ Architecture

- **Backend**: Python + FastAPI + LiteLLM
- **Frontend**: React + TypeScript + Next.js + TailwindCSS
- **AI Integration**: OpenAI GPT-4o via LiteLLM

## 📁 Project Structure

```
test-first-lecture/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── .env                # Environment variables (API keys)
│   ├── .env.example        # Environment template
│   ├── pyproject.toml      # Python dependencies
│   └── .venv/              # Virtual environment
├── frontend/               # React TypeScript frontend
│   ├── app/
│   │   └── page.tsx        # Main React component
│   ├── package.json        # Node.js dependencies
│   └── ...
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.13+ (installed via Homebrew)
- Node.js and npm
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Start the backend server:**
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start the frontend server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your-actual-api-key-here
```

## 🎯 Features

### Backend API Endpoints

- `GET /` - API status
- `GET /health` - Health check and API key validation
- `POST /chat` - General chat with AI
- `POST /generate-poem` - Generate AI poems

### Frontend Features

- **🎭 AI Poem Generator**: Generate creative poems with custom themes
- **💬 AI Chat**: Real-time conversation with AI
- **📊 Backend Status**: Monitor backend connection
- **🎨 Beautiful UI**: Modern, responsive design with TailwindCSS

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **LiteLLM**: Unified interface for 100+ LLM providers
- **Uvicorn**: ASGI server for Python
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management

### Frontend
- **Next.js**: React framework with TypeScript
- **React**: Component-based UI library
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## 🔥 Usage Examples

### Test the API directly:

```bash
# Generate a poem
curl -X POST http://localhost:8000/generate-poem \
  -H "Content-Type: application/json" \
  -d '{"theme": "space exploration"}'

# Chat with AI
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

### Use the Web Interface:

1. Open `http://localhost:3000`
2. Try the poem generator with different themes
3. Chat with the AI assistant
4. Monitor backend status

## 🎓 Learning Objectives

This project demonstrates:

- **Full-stack development** with Python and React
- **AI integration** using modern LLM APIs
- **API design** with FastAPI and proper error handling
- **Modern frontend** development with TypeScript and TailwindCSS
- **Environment management** and security best practices

## 🔗 API Documentation

When the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🚨 Troubleshooting

### Backend Issues:
- Ensure your OpenAI API key is valid and has credits
- Check that port 8000 is not in use by another application
- Verify all Python dependencies are installed: `uv sync`

### Frontend Issues:
- Ensure Node.js dependencies are installed: `npm install`
- Check that port 3000 is not in use
- Verify the backend is running on port 8000

## 🎉 Next Steps

Now that your project is set up, you can:

1. **Experiment with different AI models** in LiteLLM
2. **Add new endpoints** for specific AI tasks
3. **Enhance the UI** with more interactive features
4. **Deploy to production** using services like Vercel (frontend) and Railway (backend)

Enjoy building with AI! 🚀 