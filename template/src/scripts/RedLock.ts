import { think } from 'thinkjs';
import * as IORedis from 'ioredis';
import Redlock = require('redlock');

think.app.on("appReady", async () => {
    think.logger.info('RedLock appReady!');
    try {
        await RedLock.init();
        think.logger.info(`RedLock init`);
    } catch (error) {
        think.logger.error(error);
    }
});

export default class RedLock extends think.Service {
    private static redlock: Redlock;

    private static LockPrefix = 'Redlock:';
    static async init() {
        return new Promise((resolve, reject) => {
            let lockRedis: IORedis.Redis[] = [];
            let lockConfig = think.config('redis').redlock;
            if (think.isArray(lockConfig)) {
                lockRedis = lockConfig.map((one: any) => {
                    return new IORedis(one);
                });
            } else if (think.isObject(lockConfig)) {
                lockRedis.push(new IORedis(lockConfig));
            }
            think.logger.info('redlock redis clients:' + lockRedis.length);
            this.redlock = new Redlock(lockRedis, {
                // the expected clock drift; for more details
                // see http://redis.io/topics/distlock
                driftFactor: 0.01, // time in ms

                // the max number of times Redlock will attempt
                // to lock a resource before erroring
                retryCount: 500,

                // the time in ms between attempts
                retryDelay: 200, // time in ms

                // the max time in ms randomly added to retries
                // to improve performance under high contention
                // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                retryJitter: 200 // time in ms
            });
            this.redlock.on('clientError', (err) => {
                think.logger.error('A redis redlock error has occurred:' + err);
            });
        });
    }

    static async lock(resource: string, ttl: number) {
        return this.redlock.lock(this.LockPrefix + resource, ttl);
    }
}
