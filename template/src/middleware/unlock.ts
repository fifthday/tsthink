import * as Think from 'thinkjs';
export default (options: object, app: Think.Application) => {
    return async (ctx: Think.Context, next: () => void) => {
        try {
            await next();
        } catch (error) {
            throw error;
        } finally {
            if (!Think.think.isNullOrUndefined(ctx.state.lockers) && Think.think.isArray(ctx.state.lockers)) {
                for (let one of ctx.state.lockers) {
                    await one.unlock();
                }
                ctx.state.lockers = null;
            }
        }
    };
};
