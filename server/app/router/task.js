'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskRouter = router.namespace('/api/task')
  taskRouter.get('/', controller.task.index)
  taskRouter.get('/:id', controller.task.show)
  taskRouter.post('/', controller.task.create)
  taskRouter.put('/:id', controller.task.update)
  taskRouter.delete('/:id', controller.task.destroy)
  taskRouter.post('/:taskId/rate/task', controller.task.taskRate)
  taskRouter.post('/:taskId/rate/member', controller.task.memberRate)
  taskRouter.get('/:id/member', controller.task.showMembers)
}
