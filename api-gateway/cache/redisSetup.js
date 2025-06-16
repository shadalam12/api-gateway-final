import { createClient } from 'redis';

// Redis connection steup
const redisClient = createClient({
    username: 'default',
    password: 'y1GW7AVWjyAfjC5flXLcoZYEkQoIsy20',
    socket: {
        host: 'redis-18106.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 18106
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;