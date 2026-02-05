import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({
    url: REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error("Redis: Max reconnection retries reached. Stopping.");
                return new Error("Max retries reached");
            }
            return Math.min(retries * 50, 2000); // Wait up to 2 seconds between retries
        }
    }
});

redisClient.on("connect", () => {
    console.log("Redis: Initiating connection to vivekbase (AWS Mumbai)...");
});

redisClient.on("ready", () => {
    console.log("Redis: Successfully connected and ready for commands.");
});

redisClient.on("error", (err) => {
    console.error("Redis: Connection error encountered:", err);
});

export async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        return redisClient;
    } catch (error) {
        console.error("Redis: Failed to initialize connection:", error);
    }
}

export default redisClient;