import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MetricsDBSchema extends DBSchema {
  metrics: {
    key: string;
    value: {
      timestamp: number;
      cacheHits: number;
      cacheMisses: number;
      syncAttempts: number;
      syncSuccesses: number;
      errors: Array<{ timestamp: number; error: string }>;
      auditTrail: Array<{
        timestamp: string;
        sessionId: string;
        userId: string;
        eventType: 'connection' | 'message' | 'error';
        metadata: {
          connectionState?: string;
          messageId?: string;
          errorCode?: string;
          retryAttempt?: number;
          latency?: number;
        };
        context: {
          component: string;
          action: string;
          result: string;
        };
      }>;
    };
  };
}

class CacheMetricsService {
  private db: IDBPDatabase<MetricsDBSchema> | null = null;
  private readonly DB_NAME = 'chat_metrics';
  private readonly STORE_NAME = 'metrics';
  private readonly MAX_ERRORS = 50;
  private readonly MAX_AUDIT_EVENTS = 1000;

  constructor() {
    this.initDB().catch(console.error);
  }

  private async initDB() {
    try {
      this.db = await openDB<MetricsDBSchema>(this.DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore('metrics');
        }
      });
      console.log('Metrics DB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Metrics DB:', error);
      throw error;
    }
  }

  async recordMetric(type: 'hit' | 'miss' | 'syncAttempt' | 'syncSuccess' | 'error', error?: any) {
    if (!this.db) await this.initDB();
    
    try {
      const timestamp = Date.now();
      const metrics = await this.db?.get(this.STORE_NAME, 'current') || {
        timestamp,
        cacheHits: 0,
        cacheMisses: 0,
        syncAttempts: 0,
        syncSuccesses: 0,
        errors: [],
        auditTrail: [],
      };

      switch (type) {
        case 'hit':
          metrics.cacheHits++;
          break;
        case 'miss':
          metrics.cacheMisses++;
          break;
        case 'syncAttempt':
          metrics.syncAttempts++;
          break;
        case 'syncSuccess':
          metrics.syncSuccesses++;
          break;
        case 'error':
          metrics.errors.unshift({ 
            timestamp, 
            error: error?.message || 'Unknown error' 
          });
          metrics.errors = metrics.errors.slice(0, this.MAX_ERRORS);
          break;
      }

      await this.db?.put(this.STORE_NAME, metrics, 'current');
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }

  async recordAuditEvent(event: {
    sessionId: string;
    userId: string;
    eventType: 'connection' | 'message' | 'error';
    metadata: {
      connectionState?: string;
      messageId?: string;
      errorCode?: string;
      retryAttempt?: number;
      latency?: number;
    };
    context: {
      component: string;
      action: string;
      result: string;
    };
  }) {
    if (!this.db) await this.initDB();

    try {
      const metrics = await this.db?.get(this.STORE_NAME, 'current') || {
        timestamp: Date.now(),
        cacheHits: 0,
        cacheMisses: 0,
        syncAttempts: 0,
        syncSuccesses: 0,
        errors: [],
        auditTrail: [],
      };

      const auditEvent = {
        ...event,
        timestamp: new Date().toISOString(),
      };

      metrics.auditTrail.unshift(auditEvent);
      metrics.auditTrail = metrics.auditTrail.slice(0, this.MAX_AUDIT_EVENTS);

      await this.db?.put(this.STORE_NAME, metrics, 'current');
      console.log('Audit event recorded:', auditEvent);
    } catch (error) {
      console.error('Failed to record audit event:', error);
    }
  }

  async getMetrics() {
    if (!this.db) await this.initDB();
    return await this.db?.get(this.STORE_NAME, 'current');
  }

  async getAuditEvents(filter?: {
    eventType?: 'connection' | 'message' | 'error';
    startDate?: Date;
    endDate?: Date;
    component?: string;
  }) {
    const metrics = await this.getMetrics();
    if (!metrics?.auditTrail) return [];

    return metrics.auditTrail.filter(event => {
      if (filter?.eventType && event.eventType !== filter.eventType) return false;
      if (filter?.component && event.context.component !== filter.component) return false;
      if (filter?.startDate && new Date(event.timestamp) < filter.startDate) return false;
      if (filter?.endDate && new Date(event.timestamp) > filter.endDate) return false;
      return true;
    });
  }

  async clearMetrics() {
    if (!this.db) await this.initDB();
    await this.db?.delete(this.STORE_NAME, 'current');
  }
}

export const cacheMetrics = new CacheMetricsService();