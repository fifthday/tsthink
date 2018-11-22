import { think } from 'thinkjs';

import { createConnection, Connection, BaseEntity, getConnection } from "typeorm";

const ormConfigName = "default";// isDev ? 'default' : 'test';

// think.app.on("appReady", async () => {
//     // await think.service('orm').init();
//     think.logger.info('orm appReady!');
//     await Orm.init();
// });

// const CACHE_SEP = ':';

export default class Orm extends think.Service {
    static CACHE_MS = 3600000;

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
}
