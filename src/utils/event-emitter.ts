
/**
 * Simple event emitter class
 */
export class EventEmitter {
  private events: Record<string, Function[]> = {};

  /**
   * Register an event handler
   * @param event Event name
   * @param handler Event handler function
   */
  public on(event: string, handler: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  /**
   * Unregister an event handler
   * @param event Event name
   * @param handler Event handler function to remove
   */
  public off(event: string, handler: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  /**
   * Trigger an event with payload
   * @param event Event name
   * @param payload Event data
   */
  public emit(event: string, payload?: any): void {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Remove all events or all handlers for a specific event
   * @param event Optional event name
   */
  public clear(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }

  /**
   * Get the count of handlers for an event
   * @param event Event name
   * @returns Number of handlers
   */
  public handlerCount(event: string): number {
    return this.events[event]?.length || 0;
  }
}
