import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import DeleteModal from './DeleteModal';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeChat = allChats.find((chat) => chat.id === activeChatId);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // --- Sidebar, Chat, and Modal Management ---
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChat = { 
      id: newChatId, 
      title: 'New Chat', 
      messages: [],
      isPinned: false
    };
    setAllChats([newChat, ...allChats]);
    setActiveChatId(newChatId);
    setQuery('');
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (chatIdToDelete) => {
    if (loading && activeChatId === chatIdToDelete) {
      alert("Cannot delete while the AI is responding.");
      return;
    }
    setAllChats(allChats.filter(chat => chat.id !== chatIdToDelete));
    if (activeChatId === chatIdToDelete) {
      setActiveChatId(null);
    }
  };

  const promptToDeleteChat = (chatId) => {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
      setChatToDelete(chat);
      setIsModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (chatToDelete) {
      handleDeleteChat(chatToDelete.id);
      setIsModalOpen(false);
      setChatToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setChatToDelete(null);
  };

  const handleTogglePin = (chatId) => {
    setAllChats(
      allChats.map(chat => 
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  };

  const handleRenameChat = (chatId, newTitle) => {
    setAllChats(
      allChats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };
  
  const handleShareChat = (chatId) => {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
      const formattedContent = chat.messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.parts[0].text}`)
        .join('\n\n');
      navigator.clipboard.writeText(formattedContent);
      alert('Chat content copied to clipboard!');
    }
  };

  // --- Main Submission Handler with Fallback and Retry Logic ---
  const handleSubmit = async (voiceCommand) => {
    const textToSubmit = voiceCommand || query;
    if (!textToSubmit.trim() || !activeChatId) return;

    setLoading(true);
    const userMessage = { role: 'user', parts: [{ text: textToSubmit }] };
    
    const updatedChats = allChats.map(c => 
      c.id === activeChatId 
        ? { ...c, title: c.messages.length === 0 ? textToSubmit : c.title, messages: [...c.messages, userMessage] } 
        : c
    );
    setAllChats(updatedChats);
    setQuery('');

    const messagesForApi = updatedChats.find(chat => chat.id === activeChatId).messages;

    // Get current date and time for context
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeString = currentDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const systemContext = `Current date and time: ${dateString}, ${timeString}. Always use this information when answering questions about dates, times, or current events.`;

    // --- Primary API: Gemini with Exponential Backoff ---
    try {
      if (!geminiApiKey) {
        throw new Error("Gemini API key is not configured.");
      }
      
      let response;
      const maxRetries = 3;
      let attempt = 0;
      let lastError = null;

      while (attempt < maxRetries) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
          // Add system instruction with current date/time context
          const payload = { 
            contents: messagesForApi,
            systemInstruction: {
              parts: [{ text: systemContext }]
            }
          };

          response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            break; // Success, exit the retry loop
          } else if (response.status === 429 || response.status >= 500) {
            // If status is 429 (Too Many Requests) or a 5xx server error, retry
            const errorData = await response.json();
            lastError = new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
          } else {
            // For other client-side errors (e.g., 400), don't retry
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
          }
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt + 1} failed with network error. Retrying...`);
        }

        attempt++;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error("Gemini API failed after multiple retries.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("The response was blocked due to safety settings.");
      }

      const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
      const botResponse = { role: 'model', parts: [{ text: botResponseText }] };

      setAllChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botResponse] } : chat
        )
      );
      speak(botResponse.parts[0].text);

    } catch (geminiError) {
      console.error("Gemini API failed:", geminiError.message, "Attempting fallback to OpenAI...");

      // --- Fallback API: OpenAI ---
      try {
        if (!openaiApiKey) {
          throw new Error("OpenAI API key is not configured.");
        }
        
        const messagesForOpenAI = messagesForApi.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts[0].text
        }));

        // Add system message with current date/time at the beginning
        const url = 'https://api.openai.com/v1/chat/completions';
        const payload = {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemContext },
            ...messagesForOpenAI
          ],
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const botResponseText = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response from OpenAI.";
        const botResponse = { role: 'model', parts: [{ text: botResponseText }] };
        
        setAllChats(prevChats => 
          prevChats.map(chat => 
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botResponse] } : chat
          )
        );
        speak(botResponse.parts[0].text);

      } catch (openaiError) {
        console.error("OpenAI API also failed:", openaiError.message);
        const errorMessageText = `Sorry, both services failed. Please try again later.\n\nGemini Error: ${geminiError.message}\nOpenAI Error: ${openaiError.message}`;
        const errorMessage = { role: 'model', parts: [{ text: errorMessageText }] };
        
        setAllChats(prevChats => 
          prevChats.map(chat => 
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMessage] } : chat
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Voice and Keyboard Handlers ---
  const speak = (text) => {
    if (!isSpeechEnabled || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  
  const handleToggleSpeech = () => {
    setIsSpeechEnabled(prevState => !prevState);
    if (isSpeechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { alert("Speech recognition is not supported in this browser."); return; }
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
        setQuery(transcript);
        if (event.results[event.results.length - 1].isFinal) {
          handleSubmit(transcript.trim());
        }
      };
      
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = (e) => { console.error('Speech recognition error:', e.error); setIsRecording(false); };
      
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className={`app-layout ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
      <Sidebar
        chats={allChats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onPromptDelete={promptToDeleteChat}
        onTogglePin={handleTogglePin}
        onRenameChat={handleRenameChat}
        onShareChat={handleShareChat}
      />
      
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isSidebarVisible ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      <ChatWindow
        activeChat={activeChat}
        loading={loading}
        query={query}
        setQuery={setQuery}
        handleKeyDown={handleKeyDown}
        handleSubmit={handleSubmit}
        isRecording={isRecording}
        handleToggleRecording={handleToggleRecording}
        messagesEndRef={messagesEndRef}
        isSpeechEnabled={isSpeechEnabled}
        handleToggleSpeech={handleToggleSpeech}
      />
      
      {isModalOpen && chatToDelete && (
        <DeleteModal
          chatTitle={chatToDelete.title}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default App;
