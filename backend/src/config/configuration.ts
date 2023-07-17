export default () => ({
  port: 3001,
  database: {
    host: 'localhost',
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'kupipodariday',
    shema: 'kupipodariday',
  },
  secretKey: process.env.JWT_SECRET || 'secret-key',
});
