from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from litellm import completion
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Agent Engineering Bootcamp API", version="1.0.0")

# Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "openai/gpt-4o"

class PoemRequest(BaseModel):
    theme: str = "coding and AI"

# Response models
class ChatResponse(BaseModel):
    message: str
    model_used: str

@app.get("/")
async def root():
    return {"message": "Agent Engineering Bootcamp API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_key_configured": bool(os.getenv("OPENAI_API_KEY"))}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    General chat endpoint that can handle any conversation with AI models
    """
    try:
        # Check if API key is configured
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Convert Pydantic models to dict format expected by LiteLLM
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Make the API call
        response = completion(
            model=request.model,
            messages=messages
        )
        
        return ChatResponse(
            message=response.choices[0].message.content,
            model_used=request.model
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@app.post("/generate-poem", response_model=ChatResponse)
async def generate_poem(request: PoemRequest):
    """
    Specialized endpoint for generating poems
    """
    try:
        # Check if API key is configured
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Create the poem generation prompt
        messages = [
            {
                "role": "user", 
                "content": f"Write a beautiful short poem about {request.theme}. Make it inspiring and creative."
            }
        ]
        
        # Make the API call
        response = completion(
            model="openai/gpt-4o",
            messages=messages
        )
        
        return ChatResponse(
            message=response.choices[0].message.content,
            model_used="openai/gpt-4o"
        )
        
    except Exception as e:
        logger.error(f"Error in generate-poem endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
