
export class ChatBridge {
  private listeners: Map<string, Function[]> = new Map();
  private userSettings: Record<string, any> = {};
  private adminSettings: Record<string, any> = {};

  // Send a message to the chat component
  sendMessage(message: any) {
    console.log('ChatBridge: Sending message', message);
    this.notify('message', message);
  }

  // Send an event to the chat component
  sendEvent(eventType: string, data: any) {
    console.log(`ChatBridge: Sending event ${eventType}`, data);
    this.notify(eventType, data);
  }

  // Set user settings from the main application
  setUserSettings(settings: Record<string, any>) {
    this.userSettings = { ...this.userSettings, ...settings };
    this.notify('userSettingsChanged', this.userSettings);
  }

  // Get current user settings
  getUserSettings(): Record<string, any> {
    return { ...this.userSettings };
  }

  // Set admin settings from the main application
  setAdminSettings(settings: Record<string, any>) {
    this.adminSettings = { ...this.adminSettings, ...settings };
    this.notify('adminSettingsChanged', this.adminSettings);
  }

  // Get current admin settings
  getAdminSettings(): Record<string, any> {
    return { ...this.adminSettings };
  }

  // Register a listener for a specific event
  on(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);

    // Return an unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Remove a listener for a specific event
  off(eventType: string, callback: Function) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify all listeners of an event
  private notify(eventType: string, data: any) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ChatBridge listener for event ${eventType}:`, error);
        }
      });
    }
  }
}
