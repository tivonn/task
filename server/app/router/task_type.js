'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskTypeRouter = router.namespace('/api/taskType')
  taskTypeRouter.post('/', controller.taskType.create)
  taskTypeRouter.delete('/:id', controller.taskType.destroy)
}
