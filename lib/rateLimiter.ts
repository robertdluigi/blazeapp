// lib/rateLimiter.ts
const rateLimitMap = new Map<string, { lastRequest: number; requestCount: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 1; // Max 10 requests per window

export function rateLimiter(ip: string): boolean {
    const currentTime = Date.now();
    const rateLimit = rateLimitMap.get(ip);

    if (rateLimit) {
        if (currentTime - rateLimit.lastRequest < RATE_LIMIT_WINDOW_MS) {
            if (rateLimit.requestCount >= RATE_LIMIT_MAX_REQUESTS) {
                return false; // Rate limit exceeded
            }
            rateLimit.requestCount += 1;
        } else {
            // Reset rate limit window
            rateLimitMap.set(ip, { lastRequest: currentTime, requestCount: 1 });
        }
    } else {
        rateLimitMap.set(ip, { lastRequest: currentTime, requestCount: 1 });
    }
    
    return true; // Within rate limit
}
