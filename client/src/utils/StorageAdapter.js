/**
 * Storage API for Capacitor
 * Uses @capacitor/preferences or localStorage fallback
 */

class StorageAdapter {
  constructor() {
    this.prefix = 'pochtovik_';
  }

  async get(key) {
    try {
      // Try Capacitor Preferences first
      if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
        const item = await window.Capacitor.Plugins.Preferences.get({ key: this.prefix + key });
        return item.value ? JSON.parse(item.value) : null;
      }
      
      // Fallback to localStorage
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      
      // Try Capacitor Preferences first
      if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
        await window.Capacitor.Plugins.Preferences.set({ 
          key: this.prefix + key, 
          value: serializedValue 
        });
        return;
      }
      
      // Fallback to localStorage
      localStorage.setItem(this.prefix + key, serializedValue);
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  }

  async remove(key) {
    try {
      if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
        await window.Capacitor.Plugins.Preferences.remove({ key: this.prefix + key });
        return;
      }
      
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  }

  async clear() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
        await window.Capacitor.Plugins.Preferences.clear();
        return;
      }
      
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  async keys() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
        const result = await window.Capacitor.Plugins.Preferences.keys();
        return result.keys.filter(k => k.startsWith(this.prefix));
      }
      
      return Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }
}

// Export singleton instance
const storageAdapter = new StorageAdapter();

if (typeof window !== 'undefined') {
  window.storageAdapter = storageAdapter;
}

export default storageAdapter;
