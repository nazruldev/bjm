export default {
  driver: "memory",
  connection: {
    redisUrl: process.env.REDIS_URL,
  },
};
