import React from 'react';

// Упрощённый и оптимизированный ChatView компонент с удобной вёрсткой
const ChatViewComfortable = ({ 
  children,
  showSidebar,
  isMobile,
  onToggleSidebar,
  darkMode 
}) => {
  return (
    <div className="chat-view-container">
      {/* Sidebar - Contacts List */}
      <div className={`chat-sidebar ${showSidebar || !isMobile ? '' : 'hidden'}`}>
        {children}
      </div>
      
      {/* Chat Area */}
      <div className="chat-area">
        {/* Hamburger button for desktop */}
        {!isMobile && (
          <button
            className="hamburger-button"
            onClick={onToggleSidebar}
          >
            {showSidebar ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
        
        {/* Main content will be rendered here */}
      </div>
    </div>
  );
};

export default ChatViewComfortable;
