class RealtimeClient {
  constructor(serverUrl) {
    // Convert HTTP(S) URL to WebSocket URL
    // For production (Render): https:// -> wss://
    // For local: http:// -> ws://
    if (serverUrl.startsWith('https://')) {
      this.serverUrl = 'wss://' + serverUrl.replace('https://', '');
    } else if (serverUrl.startsWith('http://')) {
      this.serverUrl = 'ws://' + serverUrl.replace('http://', '');
    } else {
      this.serverUrl = serverUrl;
    }
    this.ws = null;
    this.userId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageHandlers = [];
    this.isConnected = false;
  }

  // Подключение к WebSocket серверу
  async connect(userId, onStatusChange) {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          if (onStatusChange) onStatusChange('connected');

          // Авторизация
          this.ws.send(JSON.stringify({
            type: 'auth',
            userId: userId
          }));
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data.toString());
          console.log('📨 WebSocket message:', message);

          if (message.type === 'auth_success') {
            resolve({ success: true, userId });
          } else {
            // Вызываем обработчики сообщений
            this.messageHandlers.forEach(handler => handler(message));
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          if (onStatusChange) onStatusChange('disconnected');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔴 WebSocket disconnected');
          this.isConnected = false;
          if (onStatusChange) onStatusChange('disconnected');
          
          // Попытка переподключения
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(userId, onStatusChange), delay);
          } else {
            console.error('❌ Max reconnect attempts reached');
            // Уведомляем UI что соединение потеряно навсегда
            if (onStatusChange) onStatusChange('failed');
          }
        };

        // Heartbeat для поддержания соединения (оптимизировано до 60 секунд)
        this.heartbeatInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 60000);

      } catch (error) {
        reject(error);
      }
    });
  }

  // Отключение
  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  // Добавление обработчика сообщений
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  // Отправка сообщения пользователю
  sendMessage(recipientId, messageData) {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket not connected');
    }

    this.ws.send(JSON.stringify({
      type: 'message',
      from: this.userId,
      to: recipientId,
      data: messageData,
      timestamp: Date.now()
    }));
  }

  // Проверка статуса пользователя
  checkPresence(userId) {
    return this.isConnected;
  }

  // Статус "печатает"
  sendTypingStatus(recipientId, isTyping) {
    if (!this.isConnected || !this.ws) return;

    this.ws.send(JSON.stringify({
      type: 'typing',
      from: this.userId,
      to: recipientId,
      isTyping,
      timestamp: Date.now()
    }));
  }
}

export default RealtimeClient;
