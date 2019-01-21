import * as path from 'path';
import { think, Context } from 'thinkjs';
const isDev = think.env === 'development';

const rateLimit = require('koa2-ratelimit');

module.exports = [
    {
        handle: rateLimit.RateLimit.middleware,
        enable: false,
        options: {
            interval: { sec: 3 }, // 15 minutes = 15*60*1000
            max: 30, // limit each IP to 100 requests per interval
            prefixKey: 'iplimit',
            onLimitReached: (ctx: Context) => {
                think.logger.error(`429:Client with ip= ${ctx.request.ip} onLimitReached,action= ${ctx.method}:${ctx.controller}/${ctx.action}, rateLimit= ${JSON.stringify(ctx.state.rateLimit)}`);
            },
        }
    },
    {
        handle: 'meta',
        options: {
            logRequest: isDev,
            sendResponseTime: isDev
        }
    },
    {
        handle: 'resource',
        enable: true,
        options: {
            root: path.join(think.ROOT_PATH, 'www'),
            publicPath: /^\/(static|favicon\.ico)/
        }
    },
    {
        handle: 'trace',
        enable: !think.isCli,
        options: {
            debug: isDev
        }
    },
    {
        handle: 'payload',
        options: {
            keepExtensions: true,
            limit: '20mb'
        }
    },
    {
        handle: 'router',
        options: {}
    },
    {
        handle: 'unlock',
        enable: true,
        options: {
            // noCodeAs: 9999,
            // notReturnCode: 500
        }
    },
    {
        handle: 'error',
        enable: true,
        options: {
            noCodeAs: 9999,
            doNotLog: [],
            // notReturnCode: 500
        }
    },
    'logic',
    'controller'
];
