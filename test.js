const redis = require("redis");
redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });