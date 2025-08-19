import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Import new icons for the mute button
import { FaPaperPlane, FaMicrophone, FaStopCircle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './ChatWindow.css';
import logo from './assets/logo.png';

const Message = ({ role, text }) => {
  const isBot = role === 'model';
  const handleCopy = () => navigator.clipboard.writeText(text);

  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
      {isBot && text && (
        <button onClick={handleCopy} className="copy-button">Copy</button>
      )}
    </div>
  );
};

function ChatWindow({
  activeChat,
  loading,
  query,
  setQuery,
  handleKeyDown,
  handleSubmit,
  isRecording,
  handleToggleRecording,
  messagesEndRef,
  // Add new props for mute functionality
  isSpeechEnabled,
  handleToggleSpeech,
}) {
  if (!activeChat) {
    return (
      <div className="chat-window empty">
        <img src={logo} alt="Chatbot Logo" className="logo" />
        <p>Select a chat or start a new one to begin.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="messages-container">
        {activeChat.messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.parts[0].text} />
        ))}
        {loading && <div className="message bot-message"><div className="loader"></div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="query-container">
        <textarea
          placeholder={isRecording ? 'Listening...' : 'Ask something...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="query-input"
          rows="1"
          disabled={loading}
        />
        <div className="button-container">
          {/* --- MUTE BUTTON ADDED HERE --- */}
          <button
            onClick={handleToggleSpeech}
            className="icon-button"
            title={isSpeechEnabled ? "Mute" : "Unmute"}
            disabled={loading}
          >
            {isSpeechEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button onClick={handleToggleRecording} className={`icon-button mic-button ${isRecording ? 'recording' : ''}`} disabled={loading}>
            {isRecording ? <FaStopCircle /> : <FaMicrophone />}
          </button>
          <button onClick={() => handleSubmit()} className="submit-button" disabled={loading || !query.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;