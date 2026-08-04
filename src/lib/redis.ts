import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) {
        console.error("Redis connection failed after 3 retries");
        return null;
      }
      return Math.min(times * 200, 1000);
    },
  });

  client.on("error", (err) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("Redis connection error (non-fatal in dev):", err.message);
    }
  });

  client.on("connect", () => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Redis connected");
    }
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─── Redis Key Helpers ────────────────────────────────────

export const RedisKeys = {
  seatLock: (scheduleId: string, seatId: string) =>
    `seat_lock:${scheduleId}:${seatId}`,
  
  sessionRateLimit: (ip: string) => `rate_limit:${ip}`,
  
  movieCache: (slug: string) => `movie:${slug}`,
  
  schedulesCache: (movieId: string, date: string) =>
    `schedules:${movieId}:${date}`,
  
  seatMapCache: (scheduleId: string) => `seat_map:${scheduleId}`,
  
  userNotificationCount: (userId: string) => `notif_count:${userId}`,
  
  bookingSession: (bookingId: string) => `booking_session:${bookingId}`,
} as const;

// ─── Seat Lock Helpers (10-min holds) ────────────────────

export const SEAT_LOCK_TTL = 600; // 10 minutes in seconds

export async function acquireSeatLock(
  scheduleId: string,
  seatId: string,
  userId: string
): Promise<boolean> {
  const key = RedisKeys.seatLock(scheduleId, seatId);
  
  // SET NX EX — atomic lock acquisition
  const result = await redis.set(key, userId, "EX", SEAT_LOCK_TTL, "NX");
  return result === "OK";
}

export async function releaseSeatLock(
  scheduleId: string,
  seatId: string,
  userId: string
): Promise<boolean> {
  const key = RedisKeys.seatLock(scheduleId, seatId);
  const currentHolder = await redis.get(key);
  
  // Only the lock holder can release it
  if (currentHolder === userId) {
    await redis.del(key);
    return true;
  }
  return false;
}

export async function getSeatLockHolder(
  scheduleId: string,
  seatId: string
): Promise<string | null> {
  const key = RedisKeys.seatLock(scheduleId, seatId);
  return redis.get(key);
}

export async function releaseAllSeatLocks(
  scheduleId: string,
  seatIds: string[],
  userId: string
): Promise<void> {
  const pipeline = redis.pipeline();
  
  for (const seatId of seatIds) {
    const key = RedisKeys.seatLock(scheduleId, seatId);
    // We'll use a Lua script for atomic check-and-delete
    pipeline.eval(
      `
      local val = redis.call('GET', KEYS[1])
      if val == ARGV[1] then
        return redis.call('DEL', KEYS[1])
      end
      return 0
      `,
      1,
      key,
      userId
    );
  }
  
  await pipeline.exec();
}
