import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({
    url: REDIS_URL
})

redisClient.on("connect", () => {
    console.log("Connecting to redis")
})

redisClient.on("ready", () => {
    console.log("Connected to redis")
})

redisClient.on("error", (err) => {
    console.log("Redis connection error", err)
})

export async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect()
        } else {
            return redisClient
        }
    } catch (error) {
        console.error("Redis connection error", error)
    }
}

export default redisClient