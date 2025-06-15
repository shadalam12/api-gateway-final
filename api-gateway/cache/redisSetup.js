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


// let rows;

// if (await redisClient.get("route_mappings")) {
//   console.log("Redis route_mappings found");
//   rows = JSON.parse(await redisClient.get("route_mappings"));
// } else {
//   rows = await RouteMapping.findAll().dataValues;

//   const plainRows = rows.map(row => row.get({ plain: true }));
//   await redisClient.set("route_mappings", JSON.stringify(plainRows));
// }

// console.log("rows", rows);