const redis = require("redis");
console.log(redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }));