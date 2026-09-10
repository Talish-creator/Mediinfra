/**
 * Site Guardian — Unified Operational Event Stream & Bus
 * Reactive event propagation connecting all operational, safety, workforce and commercial domains.
 */

export type DomainEventType =
  | "PROJECT_UPDATED"
  | "WORKER_CREATED"
  | "WORKER_VERIFIED"
  | "WORKER_ASSIGNED"
  | "WORKER_DEACTIVATED"
  | "WORK_ORDER_CREATED"
  | "WORK_ORDER_SUBMITTED"
  | "WORK_ORDER_RETURNED"
  | "WORK_ORDER_APPROVED"
  | "WORK_ORDER_REJECTED"
  | "WORKER_BRIEFING_STARTED"
  | "WORKER_BRIEFING_COMPLETED"
  | "WORKER_ACKNOWLEDGED"
  | "WORKER_SIGNED"
  | "ACCESS_AUTHORIZED"
  | "ACCESS_DENIED"
  | "GATE_ENTRY"
  | "GATE_EXIT"
  | "ATTENDANCE_IN"
  | "ATTENDANCE_OUT"
  | "LOCATION_UPDATED"
  | "ZONE_ENTERED"
  | "ZONE_EXITED"
  | "GEOFENCE_BREACH"
  | "AI_DETECTION"
  | "SAFETY_INCIDENT_CREATED"
  | "SAFETY_INCIDENT_ACKNOWLEDGED"
  | "SAFETY_INCIDENT_CLOSED"
  | "INSPECTION_CREATED"
  | "INSPECTION_FAILED"
  | "INSPECTION_PASSED"
  | "CHANGE_REQUESTED"
  | "CHANGE_APPROVED"
  | "CHANGE_REJECTED"
  | "WORK_STARTED"
  | "WORK_PROGRESS_UPDATED"
  | "WORK_COMPLETED"
  | "WORK_VERIFIED"
  | "TIMESHEET_CREATED"
  | "TIMESHEET_APPROVED"
  | "CLAIM_SUBMITTED"
  | "CLAIM_APPROVED"
  | "PAYMENT_CREATED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_RELEASED"
  | "EMERGENCY_ACTIVATED"
  | "EMERGENCY_STOOD_DOWN"
  | "BROADCAST_EMITTED";

export interface DomainEvent<T = any> {
  id: string;
  type: DomainEventType;
  timestamp: string;
  actor: string;
  role: string;
  payload: T;
  entityId?: string | undefined;
  entityType?: string | undefined;
}

type EventListener = (event: DomainEvent) => void;

class DomainEventBus {
  private listeners: Map<DomainEventType | "*", Set<EventListener>> = new Map();
  private eventHistory: DomainEvent[] = [];
  private maxHistory: number = 250;

  public subscribe(eventType: DomainEventType | "*", listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public emit<T = any>(
    type: DomainEventType,
    payload: T,
    actor: string = "System Engine",
    role: string = "Automated Operations",
    entityId?: string,
    entityType?: string,
  ): DomainEvent<T> {
    const event: DomainEvent<T> = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type,
      timestamp: new Date().toISOString(),
      actor,
      role,
      payload,
      entityId,
      entityType,
    };

    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }

    // Notify specific type listeners
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${type}:`, err);
        }
      });
    }

    // Notify wildcard listeners
    const wildcards = this.listeners.get("*");
    if (wildcards) {
      wildcards.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`[EventBus] Error in wildcard listener for ${type}:`, err);
        }
      });
    }

    return event;
  }

  public getHistory(): readonly DomainEvent[] {
    return this.eventHistory;
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const eventBus = new DomainEventBus();
