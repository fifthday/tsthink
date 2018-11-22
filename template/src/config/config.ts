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
    },
    mysql: {
        "host": "10.0.0.10",
        "port": 3306,
        "database": "test",
        "username": "root",
        "password": "",
        "entityPrefix": "dev_",
        "cache": {
            "duration": 3600000,
            // "type": "redis",
            // "options": {
            //     "host": "localhost",
            //     "port": 6379,
            //     "db": 10,
            //     "prefix": "MysqlCache:"
            // }
        },
        "synchronize": false
    }
};
