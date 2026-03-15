/**
 * PushService - Firebase Cloud Messaging (FCM) integration
 * Handles push notifications for new messages
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';

class PushService {
  constructor() {
    this.messaging = null;
    this.firebaseApp = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Firebase Cloud Messaging
   * @param {Object} firebaseConfig - Firebase configuration object
   */
  async initialize(firebaseConfig) {
    try {
      if (!firebaseConfig) {
        console.warn('⚠️ Firebase config not provided, push notifications disabled');
        return false;
      }

      // Initialize Firebase
      this.firebaseApp = initializeApp(firebaseConfig);
      this.messaging = getMessaging(this.firebaseApp);
      this.isInitialized = true;

      console.log('✅ Firebase Cloud Messaging initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing FCM:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Request permission and get FCM token
   * @returns {string|null} FCM token or null if not available
   */
  async requestPermissionAndGetToken() {
    try {
      if (!this.isInitialized) {
        console.warn('⚠️ FCM not initialized');
        return null;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('📵 Notification permission denied');
        return null;
      }

      console.log('✅ Notification permission granted');

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: this.getVapidKey()
      });

      if (token) {
        console.log('📱 FCM Token received:', token.substring(0, 20) + '...');
        return token;
      } else {
        console.warn('⚠️ No FCM token received');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Listen for foreground messages
   * @param {Function} callback - Function to call when message received
   */
  onMessageReceived(callback) {
    if (!this.isInitialized || !this.messaging) {
      console.warn('⚠️ FCM not initialized, cannot listen for messages');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('📨 Foreground message received:', payload);
      
      if (callback) {
        callback(payload);
      }

      // Show notification even in foreground
      this.showNotification({
        title: payload.data?.title || 'Новое сообщение',
        body: payload.data?.body || '',
        icon: payload.data?.icon || '/logo.png',
        data: payload.data
      });
    });
  }

  /**
   * Show local notification using Capacitor
   * @param {Object} options - Notification options
   */
  async showNotification(options) {
    const { title, body, icon, data } = options;

    try {
      // Try to use Capacitor LocalNotifications if available
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      
      if (LocalNotifications) {
        await LocalNotifications.schedule({
          notifications: [{
            title: title,
            body: body,
            id: Date.now(),
            icon: icon || 'logo.png',
            sound: 'default',
            extra: data || {},
            actionTypeId: 'OPEN_MESSAGE',
            groupId: 'pochtovik-messages'
          }]
        });

        console.log('✅ Local notification scheduled');
      } else {
        // Fallback to browser notification
        this.showBrowserNotification(title, body, icon);
      }
    } catch (error) {
      console.log('⚠️ Capacitor LocalNotifications not available, using browser notification');
      this.showBrowserNotification(title, body, icon);
    }
  }

  /**
   * Show browser notification (fallback)
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {string} icon - Notification icon URL
   */
  showBrowserNotification(title, body, icon) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: icon || '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        tag: 'pochtovik-message',
        requireInteraction: false
      });

      console.log('✅ Browser notification shown');
    }
  }

  /**
   * Unregister and cleanup
   */
  async unregister() {
    try {
      if (this.messaging && this.isInitialized) {
        await deleteToken(this.messaging);
        console.log('🗑️ FCM token deleted');
      }
      
      this.isInitialized = false;
      this.messaging = null;
      this.firebaseApp = null;
      
      console.log('✅ Push service unregistered');
    } catch (error) {
      console.error('❌ Error unregistering push service:', error);
    }
  }

  /**
   * Get VAPID key from environment or config
   * @returns {string} VAPID key
   */
  getVapidKey() {
    // This should be configured in your Firebase project
    // You can find it in Firebase Console > Project Settings > Cloud Messaging
    return process.env.REACT_APP_FIREBASE_VAPID_KEY || 
           'YOUR_VAPID_KEY_HERE'; // Replace with actual key
  }

  /**
   * Check if push notifications are supported
   * @returns {boolean} True if supported
   */
  isSupported() {
    return 'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  }

  /**
   * Check if notifications are enabled
   * @returns {boolean} True if permission granted
   */
  isEnabled() {
    return Notification.permission === 'granted';
  }
}

// Export singleton instance
const pushService = new PushService();
export default pushService;
