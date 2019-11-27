'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskTypeRouter = router.namespace('/api/taskType')
  taskTypeRouter.get('/', controller.taskType.index)
  taskTypeRouter.post('/', controller.taskType.create)
  taskTypeRouter.put('/:id', controller.taskType.update)
  taskTypeRouter.delete('/:id', controller.taskType.delete)
}
