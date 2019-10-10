'use strict'

module.exports = app => {
  const { router, controller } = app
  const userRouter = router.namespace('/api/user')  // todo 全局前缀
  userRouter.get('/', controller.user.index)
  userRouter.get('/:id', controller.user.show)
}
