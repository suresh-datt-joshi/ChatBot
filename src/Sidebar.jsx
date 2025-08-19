import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMessage, FaThumbtack } from 'react-icons/fa6';
import { BsThreeDotsVertical, BsShare, BsPencil, BsTrash } from 'react-icons/bs';
import './Sidebar.css';

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onPromptDelete, onTogglePin, onRenameChat, onShareChat }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Effect to close the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to focus the input when renaming starts
  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renamingId]);
  
  // Sort chats to show pinned ones first
  const sortedChats = [...chats].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleMenuToggle = (e, chatId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setRenamingId(chat.id);
    setRenameValue(chat.title);
    setOpenMenuId(null);
  };

  const handleSaveRename = () => {
    if (renameValue.trim()) {
      onRenameChat(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };
  
  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') setRenamingId(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">

        <div className="new-chat-container">
        <button className="new-chat-button" onClick={onNewChat}>
          <FaPlus /> New Chat
        </button>
        </div>


        <h2>Recent</h2>
      </div>

      <div className="chat-history">
        <ul>
          {sortedChats.map((chat) => (
            <li
              key={chat.id}
              className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-title-container">
                {chat.isPinned && <FaThumbtack className="pin-icon" />}
                {renamingId === chat.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    className="rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={handleSaveRename}
                    onKeyDown={handleRenameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="chat-title">{chat.title}</span>
                )}
              </div>
              <button 
                className="chat-options-button" 
                onClick={(e) => handleMenuToggle(e, chat.id)}
              >
                <BsThreeDotsVertical />
              </button>

              {openMenuId === chat.id && (
                <div className="options-menu" ref={menuRef}>
                  <button onClick={() => onShareChat(chat.id)}><BsShare /> Share</button>
                  <button onClick={() => onTogglePin(chat.id)}><FaThumbtack /> {chat.isPinned ? 'Unpin' : 'Pin'}</button>
                  <button onClick={(e) => handleStartRename(e, chat)}><BsPencil /> Rename</button>
                  <button className="delete" onClick={() => onPromptDelete(chat.id)}><BsTrash /> Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;