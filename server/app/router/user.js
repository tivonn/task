'use strict'

module.exports = app => {
  const { router, controller } = app
  const userRouter = router.namespace('/api/user')
  userRouter.get('/', controller.user.index)
  userRouter.get('/:id', controller.user.get)
}
