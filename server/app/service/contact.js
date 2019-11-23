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
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }
    }).map(item => item.contact)
    return contacts
  }

  async create (params) {
    const { ctx } = this
    const { contactId } = params
    if (contactId === ctx.state.currentUser.id) {
      ctx.throw(422, '不允许将自己设置为常联人员')
    }
    const contact = await this.userContactModel.findOne({
      where: {
        creatorId: ctx.state.currentUser.id,
        contactId
      }
    })
    if (contact) {
      ctx.throw(422, '该人员已在常联人员中')
    }
    const updateDefault = {
      creatorId: ctx.state.currentUser.id
    }
    await this.userContactModel.create(Object.assign({}, params, updateDefault))
    ctx.status = 200
  }

  async destroy (params) {
    const { ctx } = this
    const { id } = params
    const userContact = await this.userContactModel.findOne({
      where: {
        id
      }
    })
    if (!userContact) {
      ctx.throw(404, '不存在该常联人员')
    }
    if (userContact.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限删除')
    }
    await userContact.destroy()
    ctx.status = 200
  }
}

module.exports = ContactService
