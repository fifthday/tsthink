import * as Think from 'thinkjs';
import ErrorMessage from '../classes/ErrorMessage';
export default (options: any, app: Think.Application) => {
    return async (ctx: Think.Context, next: () => void) => {
        try {
            await next();
        } catch (_error) {
            let error: ErrorMessage = _error;
            if (Think.think.isEmpty(error.code)) {
                if (typeof error === 'string' || typeof error === 'number') {
                    error = new ErrorMessage(options.noCodeAs, 'Server Internal Error', String(error));
                } else if (error.message) {
                    error = new ErrorMessage(options.noCodeAs, 'Server Internal Error', error.message);
                } else {
                    error = new ErrorMessage(options.noCodeAs, 'Server Internal Error', error);
                }
            } else if (typeof error.code === 'string') {
                error = new ErrorMessage(options.noCodeAs, 'Server Internal Error', error);
            }
            let beLog = true;
            if (options.doNotLog && Think.think.isArray(options.doNotLog)) {
                if (Think.think.isNumber(error.code)) {
                    let arr: number[] = options.doNotLog;
                    if (arr.indexOf(error.code) >= 0) {
                        beLog = false;
                    }
                }
            }
            if (beLog) {
                Think.think.logger.error(`[Error]:${JSON.stringify(error)}|\n[Action]: ${ctx.method}:${ctx.controller}/${ctx.action},param:${JSON.stringify(ctx.param())},post:${JSON.stringify(ctx.post())}`);
            }

            ctx.fail(error.code, error.message);

            if (error.code === options.noCodeAs) {
                // tslint:disable-next-line:no-console
                console.trace(_error);
                throw _error;
            }
        }
        // return next();
    };
};
