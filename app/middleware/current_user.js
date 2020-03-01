'use strict'

module.exports = (options, app) => {
  return async (ctx, next) => {
    const account = ctx.headers['test.acct']
    const currentUser = await ctx.model.User.findOne({
      where: {
        account
      }
    })
    ctx.state.currentUser = currentUser
    await next()
  }
}
