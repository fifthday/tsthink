// default config
module.exports = {
    workers: 2,
    port: 8360,
    redis: {
        redlock: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 1
        },
        rateLimit: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 2
        }
    }
};
