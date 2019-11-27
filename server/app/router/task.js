'use strict'

module.exports = app => {
  const { router, controller } = app
  const taskRouter = router.namespace('/api/task')
  taskRouter.get('/', controller.task.index)
  taskRouter.get('/:id', controller.task.get)
  taskRouter.post('/', controller.task.create)
  taskRouter.put('/:id', controller.task.update)
  taskRouter.delete('/:id', controller.task.delete)
  taskRouter.post('/:taskId/rate/task', controller.task.createTaskRate)
  taskRouter.post('/:taskId/rate/member', controller.task.createMemberRate)
  taskRouter.get('/:id/member', controller.task.getMembers)
  taskRouter.post('/:taskId/plan', controller.task.createPlan)
  taskRouter.put('/:taskId/plan/:id', controller.task.updatePlan)
  taskRouter.delete('/:taskId/plan/:id', controller.task.deletePlan)
}
