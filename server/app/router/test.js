'use strict'

module.exports = app => {
  const { router, controller } = app
  const testRouter = router.namespace('/api/test')
  testRouter.get('/', controller.test.index)
}
