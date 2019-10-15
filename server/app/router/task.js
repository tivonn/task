'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskRouter = router.namespace('/api/task')
  taskRouter.get('/', controller.task.index)
  taskRouter.get('/:id', controller.task.show)
  taskRouter.post('/', controller.task.create)
  taskRouter.put('/:id', controller.task.update)
  taskRouter.delete('/:id', controller.task.destroy)
}
