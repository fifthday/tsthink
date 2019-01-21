const fileCache = require('think-cache-file');
// const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const redisCache = require('think-cache-redis');
const path = require('path');
import { think } from "thinkjs";
const isDev = think.env === "development";
const {
    Console,
    // File,
    DateFile
} = require('think-logger3');

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
    type: 'file',
    common: {
        timeout: 24 * 60 * 60 * 1000 // millisecond
    },
    file: {
        handle: fileCache,
        cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
        pathDepth: 1,
        gcInterval: 24 * 60 * 60 * 1000 // gc interval
    }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: (msg: string) => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: '',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: 'root',
    dateStrings: true,
    connectionLimit: 40,
    prefix: '',
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
    type: 'file',
    common: {
        timeout: 24 * 60 * 60 * 1000 // millisecond
    },
    file: {
        handle: fileCache,
        cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
        pathDepth: 1,
        gcInterval: 24 * 60 * 60 * 1000 // gc interval
    },
    redis: {
        handle: redisCache,
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: 1
    }
};

/**
 * view adapter config
 * @type {Object}
 */
// exports.view = {
//   type: 'nunjucks',
//   common: {
//     viewPath: path.join(think.ROOT_PATH, 'view'),
//     sep: '_',
//     extname: '.html'
//   },
//   nunjucks: {
//     handle: nunjucks
//   }
// };

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
    type: isDev ? 'console' : 'dateFile',
    console: {
        handle: Console
    },
    dateFile: {
        handle: DateFile,
        level: 'INFO',
        absolute: true,
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: true,
        filename: path.join(think.ROOT_PATH, 'logs/app.log')
    }
};
