import { createClient } from "redis";

const redis =
  process.env.REDIS_URL && typeof window === "undefined"
    ? createClient({ url: process.env.REDIS_URL })
    : null;

if (redis) redis.connect().catch(console.error);

const memoryStore = new Map<string, { count: number; expires: number }>();

export async function isRateLimited(
  key: string,
  maxAttempts = 5,
  windowSecs = 600
) {
  const now = Date.now();

  if (redis) {
    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, windowSecs);
    return attempts > maxAttempts;
  } else {
    const record = memoryStore.get(key);
    if (!record || now > record.expires) {
      memoryStore.set(key, { count: 1, expires: now + windowSecs * 1000 });
      return false;
    } else {
      record.count++;
      return record.count > maxAttempts;
    }
  }
}
