import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

type RateLimitHelper = {
    rateLimitingType?: "core";
    identifier: string;
};

type RatelimitResponse = {
  /**
   * Whether the request may pass(true) or exceeded the limit(false)
   */
  success: boolean;
  /**
   * Maximum number of requests allowed within a window.
   */
  limit: number;
  /**
   * How many requests the user has left within the current window.
   */
  remaining: number;
  /**
   * Unix timestamp in milliseconds when the limits are reset.
   */
  reset: number;

  pending: Promise<unknown>;
};

function rateLimiter() {
  const UPSATCH_ENV_FOUND = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!UPSATCH_ENV_FOUND) {
    console.log("Disabled due to not finding UPSTASH env variables");
    return () => ({ success: true, limit: 10, remaining: 999, reset: 0 } as RatelimitResponse);
  }

  // TODO: Check if creds are valid
  const redis = Redis.fromEnv();
  const limiter = {
    core: new Ratelimit({
      redis,
      analytics: true,
      prefix: "ratelimit",
      limiter: Ratelimit.fixedWindow(10, "60s"),
    }),
  };

  async function rateLimit({ rateLimitingType = "core", identifier }: RateLimitHelper) {
    return await limiter[rateLimitingType].limit(identifier);
  }

  return rateLimit;
}

export async function checkRateLimitAndThrowError({
  rateLimitingType = "core",
  identifier,
}: RateLimitHelper) {
  const { remaining, reset } = await rateLimiter()({ rateLimitingType, identifier });

  if (remaining < 0) {
    const convertToSeconds = (ms: number) => Math.floor(ms / 1000);
    const secondsToWait = convertToSeconds(reset - Date.now());
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Try again in ${secondsToWait} seconds.`,
    });
  }
}
