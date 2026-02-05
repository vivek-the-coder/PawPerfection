// rateLimiter.js
import redisClient from "./redis.js";

const createRateLimiter = ({
    windowSizeInSeconds,
    maxRequests,
    keyPrefix,
    identifierFn,
}) => {
    return async (req, res, next) => {
        try {
            const identifier = identifierFn(req);
            const key = `${keyPrefix}:${identifier}`;

            const currentCount = await redisClient.incr(key);

            if (currentCount === 1) {
                await redisClient.expire(key, windowSizeInSeconds);
            }

            if (currentCount > maxRequests) {
                const ttl = await redisClient.ttl(key);
                return res.status(429).json({
                    message: `Too many requests. Try again in ${ttl} seconds.`,
                });
            }

            next();
        } catch (error) {
            console.error("Rate limiter error:", error);
            next();
        }
    };
};

export const authRateLimiter = createRateLimiter({
    windowSizeInSeconds: 60,
    maxRequests: 7,
    keyPrefix: "auth-rate-limit",
    identifierFn: (req) => req.user?.id || req.ip,
})
export const paymentRateLimiter = createRateLimiter({
    windowSizeInSeconds: 60,
    maxRequests: 10,
    keyPrefix: "payment-rate-limit",
    identifierFn: (req) => req.user?.id || req.ip,
});
