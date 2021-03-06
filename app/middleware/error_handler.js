'use strict'

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.app.emit('error', err, ctx)
      const status = err.status || 500
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message
      ctx.status = status
      ctx.body = { error }
    }
  }
}
