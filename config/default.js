module.exports = {
  port: 3000,
  host: '127.0.0.1',
  session: {
    secret: 'LXBackendAgent',
    key: 'LXBackendAgent',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog'
};
