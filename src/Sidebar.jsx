import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaPlus, FaThumbtack } from 'react-icons/fa6';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { BsThreeDotsVertical, BsShare, BsPencil, BsTrash } from 'react-icons/bs';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import './Sidebar.css';

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onPromptDelete, onTogglePin, onRenameChat, onShareChat }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);

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
      inputRef.current.select();
    }
  }, [renamingId]);

  // Filter and sort chats
  const { pinnedChats, unpinnedChats } = useMemo(() => {
    const filtered = chats.filter(chat => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return chat.title.toLowerCase().includes(query) ||
        chat.messages.some(msg => 
          msg.parts[0]?.text?.toLowerCase().includes(query)
        );
    });

    const pinned = filtered.filter(chat => chat.isPinned);
    const unpinned = filtered.filter(chat => !chat.isPinned);
    
    return { pinnedChats: pinned, unpinnedChats: unpinned };
  }, [chats, searchQuery]);

  // Get last message preview
  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return 'No messages yet';
    const lastMsg = chat.messages[chat.messages.length - 1];
    const text = lastMsg.parts[0]?.text || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  };

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

  const renderChatItem = (chat) => (
    <li
      key={chat.id}
      className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
      onClick={() => onSelectChat(chat.id)}
    >
      <div className="chat-content">
        <div className="chat-title-container">
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
            <>
              <div className="chat-title-row">
                {chat.isPinned && <FaThumbtack className="pin-icon" />}
                <span className="chat-title">{chat.title}</span>
              </div>
              <span className="chat-preview">{getLastMessage(chat)}</span>
            </>
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
      </div>
    </li>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="new-chat-container">
          <button className="new-chat-button" onClick={onNewChat}>
            <FaPlus className="new-chat-icon" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-button"
              onClick={() => setSearchQuery('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="chat-history">
        {chats.length === 0 ? (
          <div className="empty-state">
            <HiOutlineChatBubbleLeftRight className="empty-icon" />
            <p className="empty-text">No chats yet</p>
            <p className="empty-subtext">Start a new conversation to begin</p>
          </div>
        ) : (
          <>
            {pinnedChats.length > 0 && (
              <div className="chat-section">
                <h3 className="section-title">
                  <FaThumbtack className="section-icon" />
                  Pinned
                </h3>
                <ul className="chat-list">
                  {pinnedChats.map(renderChatItem)}
                </ul>
              </div>
            )}

            {unpinnedChats.length > 0 && (
              <div className="chat-section">
                {pinnedChats.length > 0 && (
                  <h3 className="section-title">
                    <HiOutlineChatBubbleLeftRight className="section-icon" />
                    Recent
                  </h3>
                )}
                <ul className="chat-list">
                  {unpinnedChats.map(renderChatItem)}
                </ul>
              </div>
            )}

            {pinnedChats.length === 0 && unpinnedChats.length === 0 && searchQuery && (
              <div className="empty-state">
                <FaSearch className="empty-icon" />
                <p className="empty-text">No chats found</p>
                <p className="empty-subtext">Try a different search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;