/**
 * Store in-memory pour les données reçues de l'ESP32.
 * Utilise une variable globale pour persister entre les requêtes API
 * dans le même processus Node.js.
 */

export interface Esp32Reading {
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  ip?: string;
}

const MAX_READINGS = 50;

// Singleton global — survit entre les appels de route dans le même worker
const globalStore = globalThis as typeof globalThis & {
  esp32Readings?: Esp32Reading[];
};

if (!globalStore.esp32Readings) {
  globalStore.esp32Readings = [];
}

export function pushReading(reading: Esp32Reading): void {
  globalStore.esp32Readings!.push(reading);
  if (globalStore.esp32Readings!.length > MAX_READINGS) {
    globalStore.esp32Readings!.shift();
  }
}

export function getReadings(): Esp32Reading[] {
  return globalStore.esp32Readings ?? [];
}

export function clearReadings(): void {
  globalStore.esp32Readings = [];
}
