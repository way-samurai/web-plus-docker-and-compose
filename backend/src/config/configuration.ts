export default () => ({
  port: process.env.SERVER_PORT,
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    shema: process.env.POSTGRES_SHEMA,
  },
  secretKey: process.env.JWT_SECRET || 'secret-key',
});
