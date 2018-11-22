import { think } from 'thinkjs';

import { createConnection, Connection, BaseEntity, getConnection } from "typeorm";

const ormConfigName = "default";// isDev ? 'default' : 'test';

export default class Orm extends think.Service {
    static CACHE_MS = 3600000;
    static CacheSep = ':';

    static get connectionName() {
        return ormConfigName;
    }

    static get connection(): Connection {
        return getConnection(this.connectionName);
    }

    static async load() {
        try {
            const connection = await createConnection(ormConfigName);
            BaseEntity.useConnection(connection);

            if (connection.queryResultCache) {
                await connection.queryResultCache.clear();
            }
            think.logger.info(`orm start success`);
        } catch (error) {
            think.logger.error(`orm start failed`);
            think.logger.error(error);
        }
    }

    static takeCacheKey(...keys: Array<string | number>) {
        return this.takeCacheKeyAsArray(keys);
    }

    static takeCacheKeyAsArray(keys: Array<string | number>) {
        let ret = '';
        for (let one of keys) {
            if (!think.isNullOrUndefined(one)) {
                ret += String(one) + this.CacheSep;
            }
        }
        ret = ret.slice(0, ret.length - this.CacheSep.length);
        if (think.isTrueEmpty(ret)) {
            throw new Error('takeCacheKeyAsArray ret empty');
        }
        return ret;
    }

    static getCache(...keys: Array<string | number>) {
        let key = this.takeCacheKeyAsArray(keys);
        let ret = {
            cache: {
                id: key
            }
        };
        return ret;
    }

    static async removeCache(keys: string[], connection?: Connection) {
        connection = connection || this.connection;
        if (connection.queryResultCache) {
            await connection.queryResultCache.remove(keys);
        }
    }
}
