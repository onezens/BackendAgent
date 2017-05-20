module.exports = {
  port: 80,
  host: '127.0.0.1',
  agentHost: 'apidev.lexue.com',
  schema: 'http://',
  session: {
    secret: 'BackendAgent',
    key: 'BackendAgent',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog'
};
