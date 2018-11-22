import { EntityManager, Transaction, TransactionManager, Connection } from "typeorm";
import Orm from "./Orm";
import Utils from "./Utils";

export default class TransactionRunner {
    cacheKeys: string[];

    static create(): TransactionRunner {
        const trans = new TransactionRunner();
        // trans.connection = Orm.connection;
        return trans;
    }

    // async runInTransaction<T>(runInTransaction: (entityManger: EntityManager) => Promise<T>): Promise<T> {
    //     try {
    //         const connection = getConnection();
    //         this.cacheKeys = [];
    //         let ret = await connection.transaction(runInTransaction);
    //         return ret;
    //     } catch (error) {
    //         await this.clearCache();
    //         this.cacheKeys = null;
    //         throw error;
    //         // utils.throw(ErrorMessage.Codes.SqlError, error);
    //     }
    // }

    @Transaction(Orm.connectionName)
    async transaction<T>(@TransactionManager() manager: EntityManager, runInTransaction: (entityManger: EntityManager, runner: TransactionRunner) => Promise<T>): Promise<T> {
        try {
            this.cacheKeys = [];
            return runInTransaction(manager, this);
        } catch (error) {
            await this.clearCache(manager.connection);
            this.cacheKeys = null;
            throw error;
            // utils.throw(ErrorMessage.Codes.SqlError, error);
        }
    }

    addCacheOption() {
        const key = Utils.someMd5();
        this.cacheKeys.push(key);
        return {
            cache: {
                id: key,
                // milliseconds: Orm.CACHE_MS
            }
        };
    }
    async clearCache(connection: Connection) {
        if (connection.queryResultCache) {
            await connection.queryResultCache.remove(this.cacheKeys);
        }
    }
}
