class RealtimeClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl.replace('http', 'ws');
    this.ws = null;
    this.userId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageHandlers = [];
    this.isConnected = false;
  }

  // Подключение к WebSocket серверу
  async connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;

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
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔴 WebSocket disconnected');
          this.isConnected = false;
          
          // Попытка переподключения
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(userId), delay);
          } else {
            console.error('❌ Max reconnect attempts reached');
          }
        };

        // Heartbeat для поддержания соединения
        this.heartbeatInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

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
