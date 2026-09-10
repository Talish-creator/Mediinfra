/** Browser persistence boundary for demo-only domain records.
 * Domain services never access localStorage directly; replace this adapter with an API repository in production.
 */
export interface DomainRepository {
  load<T>(key: string, fallback: T): T;
  save<T>(key: string, value: T): void;
}

export const browserDomainRepository: DomainRepository = {
  load<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  save<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Demo persistence is best-effort; the in-memory source of truth remains valid.
    }
  },
};
