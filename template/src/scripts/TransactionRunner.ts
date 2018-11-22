import { EntityManager, Transaction, TransactionManager, Connection } from "typeorm";
import Orm from "./Orm";

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

    addTransCache(...keys: Array<string | number>) {
        let ret = Orm.getCache(...keys);

        this.cacheKeys.push(ret.cache.id);
        return ret;
    }
    async clearCache(connection: Connection) {
        return Orm.removeCache(this.cacheKeys, connection);
    }
}
