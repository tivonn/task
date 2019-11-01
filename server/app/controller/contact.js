'use strict'

const Controller = require('egg').Controller

const createRules = {
  contactId: {
    type: 'number',
    required: true
  }
}

const deleteRules = {
  contactId: {
    type: 'number',
    required: true
  }
}

class ContactController extends Controller {
  get contactService () {
    return this.ctx.service.contact
  }

  async index () {
    const { ctx } = this
    const allContact = await this.contactService.index()
    ctx.body = allContact
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    // todo how to warn unique
    await this.contactService.create(params)
  }

  async destroy () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.contactService.destroy(params)
  }
}

module.exports = ContactController
