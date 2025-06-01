export default {
  disk: "local",
  disks: {
    local: {
      driver: "local",
      root: "./storage",
    },
    s3: {
      driver: "s3",
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET,
    },
  },
};
