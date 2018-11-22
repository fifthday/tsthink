module.exports = [{
    "name": "online",
    "type": "mysql",
    "host": "10.0.0.10",
    "port": 3306,
    "database": "test",
    "username": "root",
    "password": "",

    "charset": "UTF8_GENERAL_CI",
    "supportBigNumbers": true,
    "bigNumberStrings": false,
    "dateStrings": true,
    "multipleStatements": false,
    "logging": ["error", "schema", "warn"],
    "maxQueryExecutionTime": 1500,
    "logger": "file",
    "entityPrefix": "proto_",
    "entities": ["app/proto/*.js"],
    "migrations": ["app/migration/*.js"],
    "cli": {
        "entitiesDir": "src/proto/",
        "migrationsDir": "src/migration/",
        // "subscribersDir": ""
    },
    "cache": {
        "duration": 3600000,
        "type": "redis",
        "options": {
            "host": "localhost",
            "port": 6379,
            "db": 10,
            "prefix": "MysqlCache:"
        }
    }
    // "synchronize": true
}];
