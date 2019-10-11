'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskTypeRouter = router.namespace('/api/taskType')  // todo 全局前缀
  taskTypeRouter.post('/', controller.taskType.create)
}
