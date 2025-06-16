'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

interface ChatMessage {
  role: string
  content: string
}

interface ApiResponse {
  message: string
  model_used: string
}

export default function Home() {
  const [poem, setPoem] = useState<string>('')
  const [poemTheme, setPoemTheme] = useState<string>('coding and AI')
  const [isGeneratingPoem, setIsGeneratingPoem] = useState<boolean>(false)
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState<string>('')
  const [isChatting, setIsChatting] = useState<boolean>(false)
  
  const [backendStatus, setBackendStatus] = useState<string>('checking...')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  // Dark mode toggle function
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    // Update document class for TailwindCSS dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      setBackendStatus(response.data.api_key_configured ? 'connected ✅' : 'connected (no API key) ⚠️')
    } catch (error) {
      setBackendStatus('disconnected ❌')
    }
  }

  // Generate poem
  const generatePoem = async () => {
    setIsGeneratingPoem(true)
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/generate-poem`, {
        theme: poemTheme
      })
      setPoem(response.data.message)
    } catch (error) {
      console.error('Error generating poem:', error)
      setPoem('Sorry, there was an error generating the poem. Please make sure the backend is running.')
    } finally {
      setIsGeneratingPoem(false)
    }
  }

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = { role: 'user', content: chatInput }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput('')
    setIsChatting(true)

    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/chat`, {
        messages: newMessages
      })
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: response.data.message 
      }
      setChatMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message. Please make sure the backend is running.' 
      }
      setChatMessages([...newMessages, errorMessage])
    } finally {
      setIsChatting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  // Initialize dark mode and check backend health on component mount
  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true'
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      }
    }
    
    checkBackendHealth()
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className={`text-4xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                🤖 Agent Engineering Bootcamp
              </h1>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Python Backend + React Frontend with AI Integration
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' 
                    : 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Backend Status:</span>
            <span className="text-sm font-semibold">{backendStatus}</span>
            <button 
              onClick={checkBackendHealth}
              className={`text-sm underline transition-colors ${
                isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Poem Generator Section */}
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              ✨ AI Poem Generator
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Poem Theme
                </label>
                <input
                  type="text"
                  value={poemTheme}
                  onChange={(e) => setPoemTheme(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter a theme for your poem..."
                />
              </div>
              
              <button
                onClick={generatePoem}
                disabled={isGeneratingPoem}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100"
              >
                {isGeneratingPoem ? '✍️ Generating...' : '🎭 Generate Poem'}
              </button>
              
              {poem && (
                <div className={`mt-6 p-4 rounded-lg border-l-4 border-blue-500 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>Your AI Poem:</h3>
                  <pre className={`whitespace-pre-wrap font-serif leading-relaxed ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {poem}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className={`rounded-xl shadow-lg p-6 flex flex-col h-[600px] transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              💬 AI Chat
            </h2>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className={`text-center mt-8 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <p>Start a conversation with AI!</p>
                  <p className="text-sm mt-2">Try asking about programming, AI, or anything else.</p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-100' 
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1 capitalize">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))
              )}
              {isChatting && (
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-xs opacity-70 mb-1">AI Assistant</div>
                  <div className="flex items-center gap-1">
                    <div className="animate-pulse">Thinking</div>
                    <div className="flex gap-1">
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{animationDelay: '0.1s'}}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
                className={`flex-1 px-3 py-2 rounded-lg resize-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Type your message... (Press Enter to send)"
                disabled={isChatting}
              />
              <button
                onClick={sendChatMessage}
                disabled={isChatting || !chatInput.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`mt-8 rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>🚀 How to Use</h2>
          <div className={`grid md:grid-cols-2 gap-6 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Backend (Python + FastAPI)</h3>
              <ul className="space-y-1">
                <li>• LiteLLM for unified AI model access</li>
                <li>• FastAPI for RESTful API endpoints</li>
                <li>• CORS enabled for frontend communication</li>
                <li>• Environment variables for API keys</li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Frontend (React + TypeScript)</h3>
              <ul className="space-y-1">
                <li>• Next.js with TypeScript for type safety</li>
                <li>• TailwindCSS for beautiful styling</li>
                <li>• Axios for HTTP requests</li>
                <li>• Real-time chat interface</li>
                <li>• Dark mode with system preference detection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
