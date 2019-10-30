'use strict'

module.exports = app => {
  const { router, controller } = app
  const tagRouter = router.namespace('/api/tag')
  tagRouter.get('/', controller.tag.index)
  tagRouter.post('/', controller.tag.create)
  tagRouter.put('/:id', controller.tag.update)
  tagRouter.delete('/:id', controller.tag.destroy)
}
