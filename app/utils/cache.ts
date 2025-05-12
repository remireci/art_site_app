const clientCache = new Map<string, any>();

export function getCached(key: string) {
  return clientCache.get(key);
}

export function setCached(key: string, value: any) {
  clientCache.set(key, value);
}
