
module.exports = {
    get sv() {
        return this.ctx.sv;
    },

    get uid() {
        return this.ctx.state.user.user_id;
    }
};
