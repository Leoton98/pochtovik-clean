/**
 * Capacitor utilities for mobile optimization
 */

// Initialize safe area insets for notched devices
export const initSafeArea = () => {
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    // Add padding for status bar on iOS/Android
    document.documentElement.style.setProperty('--ion-safe-area-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--ion-safe-area-bottom', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--ion-safe-area-left', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--ion-safe-area-right', 'env(safe-area-inset-right)');
  }
};

// Handle hardware back button
export const setupHardwareBackButton = (onBackPress) => {
  if (window.Capacitor && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
      if (onBackPress) {
        onBackPress();
      } else {
        // Default behavior - minimize app
        window.Capacitor.Plugins.App.minimizeApp();
      }
    });
  }
};

// Check if running in Capacitor
export const isCapacitor = () => {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform());
};

// Get platform info
export const getPlatformInfo = async () => {
  if (window.Capacitor && window.Capacitor.Plugins.Device) {
    try {
      const device = await window.Capacitor.Plugins.Device.getInfo();
      return {
        platform: device.platform,
        model: device.model,
        osVersion: device.osVersion,
        manufacturer: device.manufacturer
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }
  return null;
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initSafeArea();
  });
}
