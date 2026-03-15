import axios from 'axios';

class ApiService {
  constructor(nameServerUrl) {
    // Default URL will be set after deployment to Render
    this.nameServerUrl = nameServerUrl || 'https://pochtovik-name-server.onrender.com';
    this.api = axios.create({
      baseURL: this.nameServerUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Register user on name server
   */
  async registerUser(userId, password, publicKey, displayName) {
    try {
      const response = await this.api.post('/register', {
        userId,
        password,
        publicKey,
        displayName
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(userId, password) {
    try {
      const response = await this.api.post('/login', {
        userId,
        password
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's public key
   */
  async getPublicKey(userId) {
    try {
      const response = await this.api.get(`/key/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List all users
   */
  async listUsers() {
    try {
      const response = await this.api.get('/users');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user info
   */
  async updateUser(userId, updates) {
    try {
      const response = await this.api.put(`/user/${userId}/update`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      const response = await this.api.delete(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register device for multi-device support
   */
  async registerDevice(userId, deviceId, deviceInfo) {
    try {
      const response = await this.api.post('/device/register', {
        userId,
        deviceId,
        publicKey: deviceInfo.publicKey,
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all devices for user
   */
  async getUserDevices(userId) {
    try {
      const response = await this.api.get(`/devices/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove device
   */
  async removeDevice(userId, deviceId) {
    try {
      const response = await this.api.delete(`/device/${userId}/${deviceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check if name server is available
   */
  async checkHealth() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register FCM token for push notifications
   */
  async registerFcmToken(userId, deviceId, fcmToken) {
    try {
      const response = await this.api.post('/push/register', {
        userId,
        deviceId,
        fcmToken
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      return new Error('Cannot connect to name server');
    } else {
      // Other error
      return error;
    }
  }
}

export default ApiService;
