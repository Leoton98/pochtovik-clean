import React, { useState, useEffect, useRef } from 'react';
import CryptoManager from '../crypto/CryptoManager';
import RealtimeClient from '../services/RealtimeClient';
import './ChatView.comfortable.css';

// SVG Icons Collection
const Icons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Pin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Emoji: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  ),
  Mic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  DoubleCheck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 6 9 17 4 12"></polyline>
      <polyline points="22 10 13 21 11 21"></polyline>
    </svg>
  )
};

function ChatView({ user, privateKey, apiService, cloudClient, onLogout, onOpenSettings }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactId, setNewContactId] = useState('');
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedChats, setPinnedChats] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (e) {
      return true;
    }
  });
  const [userAvatar, setUserAvatar] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sendingPhoto, setSendingPhoto] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [realtimeClient, setRealtimeClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Get avatar color
  const getAvatarColor = (userId) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 172800000 && date.getDate() === now.getDate() - 1) {
      return 'Yesterday';
    }
    if (diff < 604800000) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  // Format recording time
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Common emoji
  const commonEmoji = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🎉', '👋', '🙏', '💯'];

  // Load contacts
  const loadContacts = async () => {
    try {
      const data = await apiService.listUsers();
      const filteredContacts = data.users.filter(u => u.userId !== user.userId);
      setContacts(filteredContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  // Load messages
  const loadMessages = async () => {
    if (!selectedContact) return;
    try {
      const newMessages = await cloudClient.downloadMessages(user.userId, lastMessageTimestamp);
      const contactMessages = newMessages.filter(msg => msg.senderId === selectedContact.userId);
      
      if (contactMessages.length > 0) {
        const decryptedMessages = contactMessages.map(msg => {
          try {
            const decryptedText = CryptoManager.decryptMessage(msg, privateKey);
            try {
              const parsed = JSON.parse(decryptedText);
              if (parsed.type === 'photo') {
                return { ...msg, ...parsed, text: null, direction: 'incoming' };
              } else if (parsed.type === 'voice') {
                return { ...msg, ...parsed, text: null, direction: 'incoming' };
              }
            } catch (e) {}
            return { ...msg, text: decryptedText, direction: 'incoming' };
          } catch (decryptError) {
            return { ...msg, text: '[Ошибка дешифровки]', direction: 'incoming', error: true };
          }
        });
        
        setMessages(prev => [...prev, ...decryptedMessages]);
        const maxTimestamp = Math.max(...contactMessages.map(m => m.timestamp));
        if (maxTimestamp > lastMessageTimestamp) {
          setLastMessageTimestamp(maxTimestamp);
        }
        
        const lastMsg = decryptedMessages[decryptedMessages.length - 1];
        setLastMessages(prev => ({
          ...prev,
          [selectedContact.userId]: {
            text: lastMsg.type === 'photo' ? '📷 Фото' : (lastMsg.text?.substring(0, 50) || ''),
            timestamp: lastMsg.timestamp
          }
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;
    setLoading(true);
    try {
      const keyData = await apiService.getPublicKey(selectedContact.userId);
      const encryptedPackage = CryptoManager.encryptMessage(
        messageInput,
        keyData.publicKey,
        user.userId
      );
      await cloudClient.uploadMessage(selectedContact.userId, encryptedPackage);
      
      const newMessage = {
        ...encryptedPackage,
        text: messageInput,
        direction: 'outgoing',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      setLastMessages(prev => ({
        ...prev,
        [selectedContact.userId]: {
          text: messageInput.substring(0, 50),
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select contact
  const selectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]);
    setLastMessageTimestamp(0);
    loadMessages();
    setUnreadCounts(prev => ({ ...prev, [contact.userId]: 0 }));
  };

  // Toggle pin
  const togglePinChat = (contactId, event) => {
    event.stopPropagation();
    setPinnedChats(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Add emoji
  const addEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Select photo
  const selectPhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && file.size <= 10 * 1024 * 1024) {
        setSelectedPhotoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Send photo
  const sendPhoto = async () => {
    if (!selectedPhotoFile || !selectedContact) return;
    setSendingPhoto(true);
    try {
      const photoData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedPhotoFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      
      const keyData = await apiService.getPublicKey(selectedContact.userId);
      const messageWithPhoto = {
        type: 'photo',
        fileName: selectedPhotoFile.name,
        fileType: selectedPhotoFile.type,
        data: photoData,
        timestamp: Date.now()
      };
      
      const encryptedPackage = CryptoManager.encryptMessage(
        JSON.stringify(messageWithPhoto),
        keyData.publicKey,
        user.userId
      );
      await cloudClient.uploadMessage(selectedContact.userId, encryptedPackage);
      
      const newMessage = {
        ...encryptedPackage,
        type: 'photo',
        fileName: selectedPhotoFile.name,
        photoData: photoData,
        direction: 'outgoing',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setPhotoPreview(null);
      setSelectedPhotoFile(null);
    } catch (error) {
      console.error('Error sending photo:', error);
    } finally {
      setSendingPhoto(false);
    }
  };

  // Toggle recording
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder) mediaRecorder.stop();
      if (audioStream) audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) setAudioChunks(prev => [...prev, event.data]);
        };
        recorder.start(100);
        setMediaRecorder(recorder);
        setIsRecording(true);
        setRecordingTime(0);
        const timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        window.recordingTimer = timer;
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach((msg, index) => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let label;
        if (msgDate === today) label = 'Сегодня';
        else if (msgDate === yesterday) label = 'Вчера';
        else label = new Date(msg.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        
        groups.push({ type: 'date-header', label, id: `date-${index}` });
      }
      groups.push({ type: 'message', data: msg, id: `msg-${index}` });
    });
    return groups;
  };

  // Filtered and sorted contacts
  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return contact.displayName.toLowerCase().includes(query) || contact.userId.toLowerCase().includes(query);
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aPinned = pinnedChats.includes(a.userId);
    const bPinned = pinnedChats.includes(b.userId);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Синхронизация темы с localStorage
  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [darkMode]);

  useEffect(() => {
    loadContacts();
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const rows = Math.min(5, Math.ceil(textareaRef.current.scrollHeight / 24));
      textareaRef.current.style.height = `${rows * 24}px`;
    }
  }, [messageInput]);

  return (
    <div className={`chat-view-container ${darkMode ? '' : 'light-theme'}`}>
      {/* Sidebar */}
      <div className={`chat-sidebar ${showSidebar || !isMobile ? 'show' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand-section">
            <img src="/logo.png" alt="Почтовик" className="chat-logo" />
            <h3 className="chat-title">Почтовик</h3>
          </div>
          
          <div className="user-section">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder" style={{ background: getAvatarColor(user.userId) }}>
                {(user.displayName || user.userId).charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="user-name">{user.displayName || user.userId}</h3>
          </div>
          
          <button className="settings-button" onClick={onOpenSettings}>
            <Icons.Settings />
            Настройки
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon"><Icons.Search /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск контактов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="contacts-list">
          {sortedContacts.map((contact) => {
            const lastMsg = lastMessages[contact.userId];
            const unreadCount = unreadCounts[contact.userId] || 0;
            const isOnline = onlineUsers[contact.userId];
            
            return (
              <div
                key={contact.userId}
                className={`contact-item ${selectedContact?.userId === contact.userId ? 'active' : ''}`}
                onClick={() => selectContact(contact)}
              >
                <div className="contact-avatar-wrapper">
                  <div className="contact-avatar" style={{ background: getAvatarColor(contact.userId) }}>
                    {contact.displayName.charAt(0).toUpperCase()}
                  </div>
                  {isOnline && <div className="online-indicator" />}
                </div>
                
                <div className="contact-info">
                  <div className="contact-header">
                    <span className="contact-name">{contact.displayName}</span>
                    {lastMsg && <span className="contact-time">{formatTime(lastMsg.timestamp)}</span>}
                  </div>
                  <div className="contact-preview">
                    <span>{lastMsg ? lastMsg.text : 'Нет сообщений'}</span>
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                  </div>
                </div>
                
                <button 
                  className={`pin-button ${pinnedChats.includes(contact.userId) ? 'pinned' : ''}`}
                  onClick={(e) => togglePinChat(contact.userId, e)}
                >
                  <Icons.Pin />
                </button>
              </div>
            );
          })}
          
          <button className="add-contact-button" onClick={() => setShowAddContact(true)}>
            <Icons.Plus />
            Добавить контакт
          </button>
          
          {showAddContact && (
            <div style={{ padding: '12px', background: '#242f3d', borderRadius: '12px', marginTop: '8px' }}>
              <input
                type="text"
                value={newContactId}
                onChange={(e) => setNewContactId(e.target.value)}
                placeholder="User ID"
                style={{ width: '100%', padding: '10px', marginBottom: '8px', background: '#0e1621', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <button 
                onClick={async () => {
                  await apiService.getPublicKey(newContactId);
                  loadContacts();
                  setNewContactId('');
                  setShowAddContact(false);
                }}
                style={{ width: '100%', padding: '10px', background: '#3390ec', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
              >
                Добавить
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {/* Hamburger button - всегда видима на мобильных */}
        <button className="hamburger-button" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <Icons.Close /> : <Icons.Menu />}
        </button>
        
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="header-avatar" style={{ background: getAvatarColor(selectedContact.userId) }}>
                {selectedContact.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="header-info">
                <h3 className="header-title">{selectedContact.displayName}</h3>
                <p className="header-subtitle">@{selectedContact.userId}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {groupMessagesByDate().map((item) => {
                if (item.type === 'date-header') {
                  return (
                    <div key={item.id} className="date-divider">
                      <span className="date-divider-text">{item.label}</span>
                    </div>
                  );
                }
                
                const msg = item.data;
                const isOutgoing = msg.direction === 'outgoing';
                
                return (
                  <div key={item.id} className={`message-bubble-wrapper ${isOutgoing ? 'outgoing' : ''}`}>
                    <div className={`message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                      {msg.type === 'photo' ? (
                        <div className="message-photo">
                          <img src={msg.photoData} alt="Photo" />
                        </div>
                      ) : msg.type === 'voice' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => {
                              const audio = document.getElementById(`audio-${msg.timestamp}`);
                              if (audio) {
                                playingMessageId === msg.timestamp ? audio.pause() : audio.play();
                                setPlayingMessageId(playingMessageId === msg.timestamp ? null : msg.timestamp);
                              }
                            }}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer' }}
                          >
                            {playingMessageId === msg.timestamp ? '⏸' : '▶'}
                          </button>
                          <span style={{ fontSize: '0.8rem' }}>{formatRecordingTime(msg.duration || 0)}</span>
                          <audio id={`audio-${msg.timestamp}`} src={msg.audioData} onEnded={() => setPlayingMessageId(null)} />
                        </div>
                      ) : (
                        <div className="message-text">{msg.text}</div>
                      )}
                      <div className="message-footer">
                        <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOutgoing && <span className="message-status"><Icons.DoubleCheck /></span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              {photoPreview && (
                <div className="photo-preview-container">
                  <div className="photo-preview-wrapper">
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                    <div>
                      <button className="btn-send-photo" onClick={sendPhoto} disabled={sendingPhoto}>
                        {sendingPhoto ? 'Отправка...' : 'Отправить'}
                      </button>
                      <button className="btn-cancel" onClick={() => { setPhotoPreview(null); setSelectedPhotoFile(null); }}>
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {commonEmoji.map(emoji => (
                    <button key={emoji} className="emoji-button" onClick={() => addEmoji(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="input-wrapper">
                <div className="action-buttons">
                  <button className="action-button" onClick={selectPhoto} title="Фото">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </button>
                  <button className="action-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Эмодзи">
                    <Icons.Emoji />
                  </button>
                  <button 
                    className={`action-button ${isRecording ? 'recording' : ''}`} 
                    onClick={toggleRecording}
                    title={isRecording ? 'Стоп' : 'Голос'}
                  >
                    <Icons.Mic />
                    {isRecording && <span style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '8px', background: '#000', padding: '1px 3px', borderRadius: '4px' }}>{formatRecordingTime(recordingTime)}</span>}
                  </button>
                </div>
                
                <div className="message-input-wrapper">
                  <textarea
                    ref={textareaRef}
                    className="message-input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Напишите сообщение..."
                    disabled={loading}
                    rows={1}
                  />
                </div>
                
                <button 
                  className="send-button"
                  onClick={sendMessage}
                  disabled={loading || !messageInput.trim()}
                >
                  {loading ? '⏳' : <Icons.Send />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 className="empty-state-title">Выберите контакт</h2>
              <p className="empty-state-description">Добавьте контакты через боковую панель, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatView;
