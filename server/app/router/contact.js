'use strict'

module.exports = app => {
  const { router, controller } = app
  const contactRouter = router.namespace('/api/contact')
  contactRouter.get('/', controller.contact.index)
  contactRouter.post('/', controller.contact.create)
  contactRouter.delete('/:id', controller.contact.delete)
}
