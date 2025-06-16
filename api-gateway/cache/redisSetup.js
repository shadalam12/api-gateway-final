import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

// Redis connection steup
const redisClient = createClient({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;