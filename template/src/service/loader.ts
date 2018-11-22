import { think } from 'thinkjs';
import Orm from '../scripts/Orm';
const isDev = think.env === 'development';

think.app.on("appReady", async () => {
    const loader = think.service('loader') as LoaderService;
    await loader.load();
});

export default class LoaderService extends think.Service {
    async load() {
        think.logger.info('Loader init!');

        await Orm.load();
    }
}
