'use strict'

const Service = require('egg').Service

class ContactService extends Service {
  get userContactModel () {
    return this.app.model.UserContact
  }

  async index () {
    const { ctx, app } = this
    const contacts = await this.userContactModel.findAll({
      where: {
        creatorId: ctx.state.currentUser.id
      },
      include: {
        model: app.model.User,
        as: 'contact',
        attributes: {
          exclude: ['password']
        }
      }
    }).map(item => item.contact)
    return contacts
  }

  async create (params) {
    const { ctx } = this
    if (params.contactId === ctx.state.currentUser.id) {
      ctx.throw(422, '不允许将自己设置为常联人员')
    }
    const updateDefault = {
      creatorId: ctx.state.currentUser.id
    }
    await this.userContactModel.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async destroy (params) {
    const { ctx } = this
    const { contactId } = params
    const userContact = await this.userContactModel.findOne({
      where: {
        creatorId: ctx.state.currentUser.id,
        contactId
      }
    })
    if (!userContact) {
      ctx.throw(404, '不存在该常联人员')
    }
    await userContact.destroy()
    ctx.status = 200
  }
}

module.exports = ContactService
