import React, { useState, useEffect, useRef } from 'react';
import CryptoManager from '../crypto/CryptoManager';
import RealtimeClient from '../services/RealtimeClient';
import './ChatView.css';
import '../styles/modern-ui.css';

// SVG Icons Collection
const Icons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Pin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"></line>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Emoji: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  ),
  Attach: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  Mic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  DoubleCheck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  
  // Новые state для улучшенного дизайна
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedChats, setPinnedChats] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Load theme from localStorage on initial render
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (e) {
      return true; // default to dark mode if error
    }
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    try {
      return localStorage.getItem(`avatar_${user.userId}`) || null;
    } catch (e) {
      return null;
    }
  });
  
  // Update avatar when user changes
  useEffect(() => {
    try {
      const savedAvatar = localStorage.getItem(`avatar_${user.userId}`);
      if (savedAvatar) {
        setUserAvatar(savedAvatar);
      }
    } catch (e) {
      console.error('Error loading avatar:', e);
    }
  }, [user.userId]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [textareaRows, setTextareaRows] = useState(1);
  
  // State для работы с фото
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sendingPhoto, setSendingPhoto] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  
  // State для работы с аудио
  const [audioChunks, setAudioChunks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  
  // State для управления видимостью сайдбара
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // State для WebSocket и онлайн-статусов
  const [realtimeClient, setRealtimeClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  
  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setUserAvatar(base64);
        localStorage.setItem(`avatar_${user.userId}`, base64);
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };
  
  const messagesEndRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      // Поиск применяется при рендеринге
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Авто-изменение размера textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const rows = Math.min(5, Math.ceil(textareaRef.current.scrollHeight / 24));
      setTextareaRows(rows);
    }
  }, [messageInput]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [darkMode]);

  // Скролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load contacts and messages on mount
  useEffect(() => {
    // Initialize WebSocket connection
    const initRealtime = async () => {
      try {
        const realtime = new RealtimeClient('https://pochtovik-name-server.onrender.com');
        await realtime.connect(user.userId);
        setRealtimeClient(realtime);
        
        console.log('✅ WebSocket connected for', user.userId);
        
        // Handle incoming messages
        realtime.onMessage((message) => {
          if (message.type === 'presence') {
            // Update online status
            setOnlineUsers(prev => ({
              ...prev,
              [message.userId]: message.online
            }));
          }
        });
      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
      }
    };
    
    initRealtime();
    
    loadContacts();
    loadMessages();
    
    // Poll for new messages every 5 seconds (will be replaced with WebSocket)
    const interval = setInterval(loadMessages, 5000);
    
    // Check screen size for mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', checkMobile);
    checkMobile();
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
      if (realtimeClient) {
        realtimeClient.disconnect();
      }
    };
  }, []);

  const loadContacts = async () => {
    try {
      const data = await apiService.listUsers();
      // Filter out current user
      const filteredContacts = data.users.filter(u => u.userId !== user.userId);
      setContacts(filteredContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedContact) return;
    
    try {
      const newMessages = await cloudClient.downloadMessages(user.userId, lastMessageTimestamp);
      
      // Filter messages from selected contact
      const contactMessages = newMessages.filter(msg => msg.senderId === selectedContact.userId);
      
      if (contactMessages.length > 0) {
        // Decrypt messages
        const decryptedMessages = contactMessages.map(msg => {
          try {
            console.log('Decrypting message:', { 
              hasEncryptedData: !!msg.encryptedData,
              hasEncryptedAesKey: !!msg.encryptedAesKey,
              timestamp: msg.timestamp
            });
            
            const decryptedText = CryptoManager.decryptMessage(msg, privateKey);
            
            console.log('Decryption successful:', decryptedText.substring(0, 50));
          
          // Пытаемся распарсить как JSON (для фото и других типов)
          try {
            const parsed = JSON.parse(decryptedText);
            if (parsed.type === 'photo') {
              return {
                ...msg,
                ...parsed,
                text: null,
                direction: 'incoming'
              };
            } else if (parsed.type === 'voice') {
              return {
                ...msg,
                ...parsed,
                text: null,
                direction: 'incoming'
              };
            }
          } catch (e) {
            // Это обычное текстовое сообщение
          }
          
          return {
            ...msg,
            text: decryptedText,
            direction: 'incoming'
          };
        } catch (decryptError) {
          console.error('Failed to decrypt message:', decryptError);
          console.error('Message object:', JSON.stringify(msg, null, 2));
          console.error('Private key valid:', privateKey && privateKey.includes('-----BEGIN'));
          
          // Return message with error indicator
          return {
            ...msg,
            text: '[Ошибка дешифровки: ' + decryptError.message + ']',
            direction: 'incoming',
            error: true
          };
        }
      });
        
        setMessages(prev => [...prev, ...decryptedMessages]);
        
        // Update last message timestamp
        const maxTimestamp = Math.max(...contactMessages.map(m => m.timestamp));
        if (maxTimestamp > lastMessageTimestamp) {
          setLastMessageTimestamp(maxTimestamp);
        }
        
        // Update last message for this contact
        const lastMsg = decryptedMessages[decryptedMessages.length - 1];
        setLastMessages(prev => ({
          ...prev,
          [selectedContact.userId]: {
            text: lastMsg.type === 'photo' ? '📷 Фото' : (lastMsg.text?.substring(0, 50) || ''),
            timestamp: lastMsg.timestamp
          }
        }));
        
        // Update unread count for other contacts
        const otherNewMessages = newMessages.filter(msg => msg.senderId !== selectedContact.userId);
        if (otherNewMessages.length > 0) {
          setUnreadCounts(prev => {
            const updated = { ...prev };
            otherNewMessages.forEach(msg => {
              updated[msg.senderId] = (updated[msg.senderId] || 0) + 1;
            });
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;
    
    setLoading(true);
    try {
      console.log('🔐 Отправка сообщения:', messageInput.substring(0, 50));
      console.log('Получатель:', selectedContact.userId);
      
      // Get recipient's public key
      const keyData = await apiService.getPublicKey(selectedContact.userId);
      
      console.log('🔑 Публичный ключ получен:', {
        hasPublicKey: !!keyData.publicKey,
        keyStart: keyData.publicKey ? keyData.publicKey.substring(0, 30) : 'N/A',
        keyFormat: keyData.publicKey?.includes('-----BEGIN') ? 'PEM' : 'UNKNOWN'
      });
      
      if (!keyData.publicKey || !keyData.publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
        throw new Error('Неверный формат публичного ключа. Ожидается PEM формат.');
      }
      
      // Encrypt message
      const encryptedPackage = CryptoManager.encryptMessage(
        messageInput,
        keyData.publicKey,
        user.userId
      );
      
      console.log('✅ Сообщение зашифровано:', {
        hasEncryptedAesKey: !!encryptedPackage.encryptedAesKey,
        hasEncryptedData: !!encryptedPackage.encryptedData,
        timestamp: encryptedPackage.timestamp
      });
      
      // Upload to cloud
      await cloudClient.uploadMessage(selectedContact.userId, encryptedPackage);
      
      // Add to local messages
      const newMessage = {
        ...encryptedPackage,
        text: messageInput,
        direction: 'outgoing',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      // Update last message for this contact
      setLastMessages(prev => ({
        ...prev,
        [selectedContact.userId]: {
          text: messageInput.substring(0, 50) + (messageInput.length > 50 ? '...' : ''),
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async () => {
    if (!newContactId.trim()) return;
    
    try {
      // Verify contact exists
      await apiService.getPublicKey(newContactId);
      
      // Add to contacts
      loadContacts();
      setNewContactId('');
      setShowAddContact(false);
    } catch (error) {
      alert('Contact not found: ' + error.message);
    }
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setMessages([]);
    setLastMessageTimestamp(0);
    loadMessages();
    
    // Clear unread count for this contact
    setUnreadCounts(prev => ({ ...prev, [contact.userId]: 0 }));
  };

  // Закрепить/открепить чат
  const togglePinChat = (contactId, event) => {
    event.stopPropagation();
    setPinnedChats(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Фильтрация чатов по поиску
  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return contact.displayName.toLowerCase().includes(query) ||
           contact.userId.toLowerCase().includes(query);
  });

  // Сортировка чатов: закрепленные сверху
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aPinned = pinnedChats.includes(a.userId);
    const bPinned = pinnedChats.includes(b.userId);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  // Группировка сообщений по дате
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
        if (msgDate === today) {
          label = 'Сегодня';
        } else if (msgDate === yesterday) {
          label = 'Вчера';
        } else {
          label = new Date(msg.timestamp).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
          });
        }
        
        groups.push({ type: 'date-header', label, id: `date-${index}` });
      }
      
      groups.push({ type: 'message', data: msg, id: `msg-${index}` });
    });
    
    return groups;
  };

  // Форматирование времени сообщения
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Статусы сообщений
  const getMessageStatus = (msg) => {
    if (msg.direction === 'incoming') return 'received';
    // Для исходящих - симуляция статусов
    if (msg.status === 'read') return 'read';
    if (msg.status === 'delivered') return 'delivered';
    if (msg.status === 'sent') return 'sent';
    return 'sent'; // По умолчанию
  };

  // Обработка emoji
  const addEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Прикрепление файла
  const attachFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*'; // Любые файлы
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && selectedContact) {
        setLoading(true);
        try {
          // Здесь будет логика загрузки файла
          alert(`Файл "${file.name}" будет отправлен (функционал в разработке)`);
        } catch (error) {
          console.error('Error attaching file:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  // Выбор фото для отправки
  const selectPhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Только изображения
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Проверка размера (макс 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('Размер файла не должен превышать 10MB');
          return;
        }
        
        setSelectedPhotoFile(file);
        
        // Создаем preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Отправка фото
  const sendPhoto = async () => {
    if (!selectedPhotoFile || !selectedContact) return;
    
    setSendingPhoto(true);
    try {
      // Конвертируем фото в Base64
      const photoData = await fileToBase64(selectedPhotoFile);
      
      // Получаем публичный ключ получателя
      const keyData = await apiService.getPublicKey(selectedContact.userId);
      
      // Создаем сообщение с фото
      const messageWithPhoto = {
        type: 'photo',
        fileName: selectedPhotoFile.name,
        fileType: selectedPhotoFile.type,
        data: photoData, // Base64 строка
        timestamp: Date.now()
      };
      
      // Шифруем сообщение
      const encryptedPackage = CryptoManager.encryptMessage(
        JSON.stringify(messageWithPhoto),
        keyData.publicKey,
        user.userId
      );
      
      // Загружаем в облако
      await cloudClient.uploadMessage(selectedContact.userId, encryptedPackage);
      
      // Добавляем локально
      const newMessage = {
        ...encryptedPackage,
        type: 'photo',
        fileName: selectedPhotoFile.name,
        fileType: selectedPhotoFile.type,
        photoData: photoData,
        direction: 'outgoing',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Очищаем
      setPhotoPreview(null);
      setSelectedPhotoFile(null);
    } catch (error) {
      console.error('Error sending photo:', error);
      alert('Ошибка при отправке фото: ' + error.message);
    } finally {
      setSendingPhoto(false);
    }
  };

  // Отмена отправки фото
  const cancelPhotoSend = () => {
    setPhotoPreview(null);
    setSelectedPhotoFile(null);
  };

  // Утилита для конвертации File в Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Запись голосового сообщения
  const toggleRecording = async () => {
    if (isRecording) {
      // Остановка записи
      stopRecording();
    } else {
      // Начало записи
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          } 
        });
        
        setAudioStream(stream);
        
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks(prev => [...prev, event.data]);
          }
        };
        
        recorder.onstop = () => {
          sendVoiceMessage();
        };
        
        recorder.start(100); // Собираем данные каждые 100мс
        setMediaRecorder(recorder);
        setIsRecording(true);
        setRecordingTime(0);
        
        // Таймер для отображения времени записи
        const timerInterval = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        // Сохраняем интервал для очистки
        window.recordingTimer = timerInterval;
        
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
        setIsRecording(false);
      }
    }
  };
  
  // Остановка записи
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      clearInterval(window.recordingTimer);
      
      // Останавливаем все треки в потоке
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      setMediaRecorder(null);
      setAudioStream(null);
    }
  };
  
  // Отправка голосового сообщения
  const sendVoiceMessage = async () => {
    if (audioChunks.length === 0 || !selectedContact) return;
    
    setSendingPhoto(true); // Используем тот же индикатор загрузки
    try {
      // Создаем Blob из записанных данных
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      
      // Конвертируем в Base64
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Получаем публичный ключ получателя
      const keyData = await apiService.getPublicKey(selectedContact.userId);
      
      // Создаем сообщение с аудио
      const messageWithAudio = {
        type: 'voice',
        audioData: audioBase64,
        mimeType: 'audio/webm',
        duration: recordingTime,
        timestamp: Date.now()
      };
      
      // Шифруем сообщение
      const encryptedPackage = CryptoManager.encryptMessage(
        JSON.stringify(messageWithAudio),
        keyData.publicKey,
        user.userId
      );
      
      // Загружаем в облако
      await cloudClient.uploadMessage(selectedContact.userId, encryptedPackage);
      
      // Добавляем локально
      const newMessage = {
        ...encryptedPackage,
        type: 'voice',
        audioData: audioBase64,
        mimeType: 'audio/webm',
        duration: recordingTime,
        direction: 'outgoing',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Очищаем
      setAudioChunks([]);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error sending voice message:', error);
      alert('Ошибка при отправке голосового: ' + error.message);
    } finally {
      setSendingPhoto(false);
    }
  };
  
  // Утилита для конвертации Blob в Base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  
  // Форматирование времени записи (мм:сс)
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Воспроизведение/пауза голосового сообщения
  const toggleVoicePlayback = (messageId, audioData) => {
    const existingAudio = document.getElementById(`audio-${messageId}`);
    
    if (playingMessageId === messageId && existingAudio) {
      // Если это сообщение уже играет - ставим на паузу
      existingAudio.pause();
      setPlayingMessageId(null);
    } else {
      // Останавливаем все остальные аудио
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      
      // Играем текущее
      if (existingAudio) {
        existingAudio.play();
        setPlayingMessageId(messageId);
        
        existingAudio.onended = () => {
          setPlayingMessageId(null);
        };
      }
    }
  };

  // Get avatar color based on user ID
  const getAvatarColor = (userId) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Базовые emoji для быстрого доступа
  const commonEmoji = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🎉', '👋', '🙏', '💯'];

  // Format message time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Today
    if (diff < 86400000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday
    if (diff < 172800000 && date.getDate() === now.getDate() - 1) {
      return 'Yesterday';
    }
    
    // This week
    if (diff < 604800000) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    
    // Older
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  // CSS стили для тем
  const theme = {
    bg: darkMode 
      ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sidebar: darkMode
      ? 'rgba(30, 30, 46, 0.98)'
      : 'rgba(255, 255, 255, 0.98)',
    text: darkMode ? '#ffffff' : '#1a1a2e',
    textSecondary: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    messageOutgoing: darkMode ? '#667eea' : '#0084ff',
    messageIncoming: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
    inputBg: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    border: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accentGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  };

  return (
    <div className="chat-view-container" style={{ 
      display: 'flex', 
      height: '100vh',
      background: theme.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: theme.primaryGradient,
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem'
        }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
          >
            {showSidebar ? <Icons.Close /> : <Icons.Menu />}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/logo.png" 
              alt="Почтовик"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))'
              }}
            />
            <h1 style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.02em'
            }}>Почтовик</h1>
          </div>
          
          <button
            onClick={onOpenSettings}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Icons.Settings />
          </button>
        </div>
      )}
      
      {/* Overlay для затемнения фона при закрытом сайдбаре на мобильных */}
      {isMobile && !showSidebar && selectedContact && (
        <div 
          onClick={() => setShowSidebar(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            background: theme.primaryGradient,
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#fff',
              fontSize: '2.5rem',
              marginBottom: '1rem'
            }}>
              <Icons.Menu />
            </div>
            <p style={{
              margin: 0,
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>Нажмите, чтобы открыть контакты</p>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className="chat-sidebar" style={{ 
        width: '100%',
        maxWidth: isMobile ? (showSidebar ? '100%' : '0') : '380px',
        display: showSidebar || !isMobile ? 'flex' : 'none',
        flexDirection: 'column',
        background: theme.sidebar,
        backdropFilter: 'blur(20px)',
        borderRight: isMobile ? 'none' : `1px solid ${theme.border}`,
        boxShadow: isMobile ? '0 4px 24px rgba(0, 0, 0, 0.3)' : '4px 0 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? '60px' : '0',
        left: isMobile ? '0' : '0',
        right: isMobile ? '0' : 'auto',
        bottom: '0',
        zIndex: isMobile ? 999 : 'auto'
      }}>
        {/* Header с профилем и настройками */}
        <div className="chat-header" style={{  
          padding: '1rem', 
          background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Почтовик"
              className="chat-logo"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                flexShrink: 0,
                filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.3))'
              }}
            />
            <h3 className="chat-title" style={{ 
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '700',
              color: theme.text
            }}>Почтовик</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Avatar */}
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="Avatar"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            ) : (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: getAvatarColor(user.userId),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {(user.displayName || user.userId).charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="user-name" style={{ 
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '700',
              color: theme.text
            }}>{user.displayName || user.userId}</h3>
          </div>
          <button 
            onClick={onOpenSettings}
            style={{ 
              width: '100%',
              marginTop: '0.75rem',
              padding: '0.625rem',
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Icons.Settings />
            Настройки
          </button>
        </div>

        {/* Поиск по чатам */}
        <div style={{ padding: '0.75rem', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.1rem',
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icons.Search />
            </span>
            <input
              className="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск контактов..."
              style={{
                width: '100%',
                padding: '0.75rem 0.875rem 0.75rem 2.75rem',
                background: theme.inputBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                color: theme.text,
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>

        {/* Контакты */}
        <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          <button 
            onClick={() => setShowAddContact(!showAddContact)}
            style={{ 
              width: '100%',
              marginBottom: '0.75rem',
              padding: '0.875rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              background: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Icons.Plus />
            Добавить контакт
          </button>
          
          {showAddContact && (
            <div style={{ 
              marginBottom: '0.75rem',
              padding: '0.75rem',
              background: theme.inputBg,
              borderRadius: '10px',
              border: `1px solid ${theme.border}`
            }}>
              <input
                type="text"
                value={newContactId}
                onChange={(e) => setNewContactId(e.target.value)}
                placeholder="User ID"
                style={{ 
                  width: '100%',
                  marginBottom: '0.625rem',
                  padding: '0.75rem',
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  fontSize: '0.9rem'
                }}
              />
              <button onClick={addContact} style={{ 
                width: '100%',
                padding: '0.75rem',
                background: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                color: theme.text,
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Icons.Check />
                Добавить
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sortedContacts.map(contact => {
              const lastMsg = lastMessages[contact.userId];
              const unreadCount = unreadCounts[contact.userId] || 0;
              const isSelected = selectedContact?.userId === contact.userId;
              const isPinned = pinnedChats.includes(contact.userId);
              
              return (
                <div
                  className="contact-item"
                  key={contact.userId}
                  onClick={() => selectContact(contact)}
                  style={{
                    padding: '0.75rem',
                    cursor: 'pointer',
                    background: isSelected 
                      ? (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')
                      : (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                    borderRadius: '10px',
                    border: isSelected 
                      ? `2px solid ${darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`
                      : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isSelected 
                      ? (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')
                      : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isSelected 
                      ? (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')
                      : (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)');
                  }}
                >
                  {/* Кнопка Pin */}
                  <button
                    onClick={(e) => togglePinChat(contact.userId, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: isPinned ? 1 : 0.3,
                      transition: 'all 0.2s',
                      marginRight: '0.25rem',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.text
                    }}
                    title={isPinned ? 'Открепить' : 'Закрепить'}
                  >
                    <Icons.Pin />
                  </button>
                  
                  {/* Avatar */}
                  <div className="contact-avatar" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: getAvatarColor(contact.userId),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                    position: 'relative'
                  }}>
                    {contact.displayName.charAt(0).toUpperCase()}
                    
                    {/* Индикатор онлайн-статуса */}
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: onlineUsers[contact.userId] ? '#4ade80' : '#9ca3af',
                      border: '2px solid ' + theme.sidebar,
                      boxShadow: onlineUsers[contact.userId] ? '0 0 8px rgba(74, 222, 128, 0.6)' : 'none',
                      transition: 'all 0.3s ease'
                    }} title={onlineUsers[contact.userId] ? 'Онлайн' : 'Офлайн'} />
                  </div>
                  
                  {/* Contact Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span className="contact-name" style={{ 
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: theme.text,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {contact.displayName}
                      </span>
                      {lastMsg && (
                        <span style={{ 
                          fontSize: '0.7rem',
                          color: theme.textSecondary,
                          flexShrink: 0,
                          marginLeft: '0.5rem'
                        }}>
                          {formatTime(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '0.8rem',
                        color: lastMsg ? theme.textSecondary : 'rgba(128, 128, 128, 0.6)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {lastMsg ? lastMsg.text : 'Нет сообщений'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="unread-badge" style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          minWidth: '20px',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(79, 172, 254, 0.4)'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Область чата */}
      <div className="chat-area" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        marginLeft: isMobile ? '0' : (showSidebar ? '0' : '380px'),
        transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%'
      }}>
        {/* Кнопка гамбургер для десктопа */}
        {!isMobile && (
          <button
            className="hamburger-button"
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              zIndex: 100,
              background: theme.sidebar,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '0.625rem',
              cursor: 'pointer',
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = theme.sidebar;
            }}
            title={showSidebar ? 'Закрыть меню' : 'Открыть меню'}
          >
            {showSidebar ? <Icons.Close /> : <Icons.Menu />}
          </button>
        )}
        
        {selectedContact ? (
          <>
            {/* Заголовок чата */}
            <div className="chat-header" style={{ 
              padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
              paddingLeft: !isMobile && showSidebar ? '5rem' : '1rem',
              borderBottom: `1px solid ${theme.border}`,
              background: theme.sidebar,
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              paddingTop: isMobile ? 'calc(0.75rem + env(safe-area-inset-top))' : '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: getAvatarColor(selectedContact.userId),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#fff',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {selectedContact.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="chat-header-title" style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: theme.text
                }}>{selectedContact.displayName}</h3>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: theme.textSecondary,
                  marginTop: '0.1rem'
                }}>
                  @{selectedContact.userId}
                </div>
              </div>
            </div>

            {/* Сообщения с группировкой по дате */}
            <div className="chat-scroll" style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
              background: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.5)'
            }}>
              {groupMessagesByDate().map((item) => {
                if (item.type === 'date-header') {
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '1rem 0 0.75rem 0'
                      }}>
                      <span style={{
                        background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        color: theme.textSecondary,
                        padding: '0.375rem 1rem',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {item.label}
                      </span>
                    </div>
                  );
                }
                
                const msg = item.data;
                const status = getMessageStatus(msg);
                
                return (
                  <div
                    key={item.id}
                    className="message-bubble-wrapper"
                    style={{
                      display: 'flex',
                      justifyContent: msg.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                      animation: 'slideUp 0.3s ease'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: msg.type === 'photo' ? '80%' : msg.type === 'voice' ? '75%' : '70%',
                        padding: msg.type === 'photo' ? '0.375rem' : '0.75rem 1rem',
                        borderRadius: '16px',
                        background: msg.direction === 'outgoing' 
                          ? theme.messageOutgoing
                          : theme.messageIncoming,
                        color: msg.direction === 'outgoing' ? '#fff' : theme.text,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {msg.type === 'photo' ? (
                        <div className="message-photo">
                          <img 
                            src={msg.photoData} 
                            alt="Photo" 
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              borderRadius: '10px',
                              display: 'block',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              // Открываем фото на весь экран
                              const win = window.open('', '_blank');
                              if (win) {
                                win.document.write(`
                                  <!DOCTYPE html>
                                  <html style="margin:0;padding:0;height:100%;">
                                    <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;background:rgba(0,0,0,0.9);">
                                      <img src="${msg.photoData}" style="max-width:100%;max-height:100vh;object-fit:contain;">
                                    </body>
                                  </html>
                                `);
                              }
                            }}
                          />
                          <div style={{
                            padding: '0.375rem 0.625rem 0.25rem',
                            fontSize: '0.8rem',
                            opacity: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span>📷 {msg.fileName || 'Фото'}</span>
                          </div>
                        </div>
                      ) : msg.type === 'voice' ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          minWidth: '200px'
                        }}>
                          <button
                            onClick={() => toggleVoicePlayback(msg.timestamp, msg.audioData)}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: playingMessageId === msg.timestamp 
                                ? 'rgba(255, 255, 255, 0.3)' 
                                : 'rgba(255, 255, 255, 0.2)',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = playingMessageId === msg.timestamp 
                                ? 'rgba(255, 255, 255, 0.3)' 
                                : 'rgba(255, 255, 255, 0.2)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {playingMessageId === msg.timestamp ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            )}
                          </button>
                          
                          {/* Визуализация волны */}
                          <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            height: '30px',
                            overflow: 'hidden'
                          }}>
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  width: '3px',
                                  height: `${Math.random() * 20 + 5}px`,
                                  background: 'rgba(255, 255, 255, 0.6)',
                                  borderRadius: '2px',
                                  transition: 'height 0.1s ease',
                                  animation: playingMessageId === msg.timestamp 
                                    ? `wave 0.5s ease-in-out infinite ${i * 0.05}s` 
                                    : 'none'
                                }}
                              />
                            ))}
                          </div>
                          
                          <span style={{
                            fontSize: '0.8rem',
                            opacity: 0.7,
                            minWidth: '35px',
                            textAlign: 'right'
                          }}>
                            {formatRecordingTime(msg.duration || 0)}
                          </span>
                          
                          <audio 
                            id={`audio-${msg.timestamp}`}
                            src={msg.audioData}
                            onEnded={() => setPlayingMessageId(null)}
                          />
                        </div>
                      ) : (
                        <div className="message-text" style={{ 
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}>{msg.text}</div>
                      )}
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: msg.type === 'photo' ? '0.375rem' : '0.25rem',
                        fontSize: '0.7rem',
                        opacity: 0.7
                      }}>
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {msg.direction === 'outgoing' && (
                          <span style={{ display: 'flex', alignItems: 'center' }} title={{
                            'sent': 'Отправлено',
                            'delivered': 'Доставлено',
                            'read': 'Прочитано'
                          }[status]}>
                            {status === 'read' ? <Icons.DoubleCheck /> : status === 'delivered' ? <Icons.DoubleCheck /> : <Icons.Check />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Панель ввода сообщений */}
            <div className="message-input-area" style={{ 
              padding: '1rem 1.25rem', 
              borderTop: `1px solid ${theme.border}`,
              background: theme.sidebar,
              backdropFilter: 'blur(20px)'
            }}>
              {/* Предпросмотр фото */}
              {photoPreview && (
                <div style={{
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '14px',
                  border: `2px solid ${theme.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '0.75rem'
                  }}>
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: theme.text,
                        marginBottom: '0.375rem',
                        fontWeight: '600'
                      }}>
                        📷 {selectedPhotoFile?.name || 'Фото'}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary,
                        marginBottom: '0.75rem'
                      }}>
                        {selectedPhotoFile?.size ? Math.round(selectedPhotoFile.size / 1024) + ' KB' : ''}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={sendPhoto}
                          disabled={sendingPhoto}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontWeight: '600',
                            cursor: sendingPhoto ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                        >
                          {sendingPhoto ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" opacity="0.25" />
                              <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75">
                                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                              </path>
                            </svg>
                          ) : (
                            <Icons.Send />
                          )}
                          Отправить
                        </button>
                        <button
                          onClick={cancelPhotoSend}
                          style={{
                            padding: '0.5rem 1rem',
                            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '10px',
                            color: theme.text,
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.85rem'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Emoji picker */}
              {showEmojiPicker && (
                <div style={{
                  marginBottom: '0.625rem',
                  padding: '0.625rem',
                  background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: '0.375rem',
                  flexWrap: 'wrap'
                }}>
                  {commonEmoji.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.3rem',
                        padding: '0.25rem',
                        transition: 'all 0.2s',
                        borderRadius: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'scale(1.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                gap: '0.625rem', 
                alignItems: 'flex-end',
                padding: '0.25rem'
              }}>
                {/* Кнопки слева */}
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button 
                    className="action-button"
                    onClick={selectPhoto}
                    style={{
                      padding: '0.75rem',
                      background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                      border: `2px solid ${theme.border}`,
                      cursor: 'pointer',
                      borderRadius: '14px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: theme.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      flexShrink: 0
                    }}
                    title="Отправить фото"
                    onMouseEnter={(e) => {
                      e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      padding: '0.75rem',
                      background: showEmojiPicker ? (darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)') : 'none',
                      border: `2px solid ${theme.border}`,
                      cursor: 'pointer',
                      borderRadius: '14px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: theme.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      flexShrink: 0
                    }}
                    title="Эмодзи"
                    onMouseEnter={(e) => {
                      e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = showEmojiPicker ? (darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)') : 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Icons.Emoji />
                  </button>
                  <button 
                    className="action-button"
                    onClick={toggleRecording}
                    style={{
                      padding: '0.75rem',
                      background: isRecording ? 'rgba(245, 87, 108, 0.9)' : 'none',
                      border: `2px solid ${isRecording ? 'rgba(245, 87, 108, 0.5)' : theme.border}`,
                      cursor: 'pointer',
                      borderRadius: '14px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: theme.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      flexShrink: 0,
                      animation: isRecording ? 'pulse 1s infinite' : 'none',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    title={isRecording ? 'Остановить запись' : 'Записать голосовое'}
                    onMouseEnter={(e) => {
                      if (!isRecording) {
                        e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRecording) {
                        e.target.style.background = 'none';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {isRecording ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        height: '20px'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '3px',
                              height: `${Math.random() * 16 + 4}px`,
                              background: '#fff',
                              borderRadius: '2px',
                              animation: `wave 0.5s ease-in-out infinite ${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Icons.Mic />
                    )}
                    {isRecording && (
                      <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#fff',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '2px 4px',
                        borderRadius: '4px'
                      }}>
                        {formatRecordingTime(recordingTime)}
                      </div>
                    )}
                  </button>
                </div>
                
                {/* Поле ввода */}
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
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
                    rows={textareaRows}
                    style={{ 
                      width: '100%',
                      padding: '0.875rem 1rem',
                      paddingRight: '2.75rem',
                      fontSize: '0.9rem',
                      background: theme.inputBg,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '24px',
                      color: theme.text,
                      outline: 'none',
                      resize: 'none',
                      fontFamily: "'Inter', sans-serif",
                      minHeight: '44px',
                      maxHeight: '120px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: darkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = messageInput.trim() && !loading
                        ? '#667eea' 
                        : (darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)');
                      e.target.style.background = darkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.9)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.background = theme.inputBg;
                      e.target.style.boxShadow = darkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                  />
                </div>
                
                {/* Кнопка отправки */}
                <button 
                  className="send-button"
                  onClick={sendMessage}
                  disabled={loading || !messageInput.trim()}
                  style={{
                    padding: '0.875rem 1.5rem',
                    minWidth: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    background: messageInput.trim() && !loading
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
                    border: 'none',
                    color: messageInput.trim() && !loading ? '#fff' : theme.textSecondary,
                    borderRadius: '24px',
                    cursor: messageInput.trim() && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '1.2rem',
                    boxShadow: messageInput.trim() && !loading 
                      ? '0 4px 16px rgba(102, 126, 234, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.1)' 
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (messageInput.trim() && !loading) {
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5), inset 0 -2px 0 rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (messageInput.trim() && !loading) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseDown={(e) => {
                    if (messageInput.trim() && !loading) {
                      e.target.style.transform = 'translateY(0) scale(0.98)';
                    }
                  }}
                >
                  {loading ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                      </path>
                    </svg>
                  ) : (
                    <Icons.Send />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: theme.textSecondary
          }}>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ 
                fontSize: '6rem', 
                marginBottom: '1.5rem',
                opacity: 0.5,
                display: 'flex',
                justifyContent: 'center',
                color: theme.textSecondary
              }}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 style={{ 
                fontSize: '2rem', 
                marginBottom: '0.75rem',
                color: theme.text,
                fontWeight: '700'
              }}>Выберите контакт</h2>
              <p style={{ 
                fontSize: '1rem',
                color: theme.textSecondary,
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Добавьте контакты через боковую панель, чтобы начать общение
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatView;
