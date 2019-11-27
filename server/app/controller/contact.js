'use strict'

const Controller = require('egg').Controller

const createRules = {
  contactId: {
    type: 'number',
    required: true
  }
}

const deleteRules = {
  id: {
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
    const contacts = await this.contactService.index()
    ctx.body = contacts
  }

  async create () {
    const { ctx } = this
    const params = ctx.filterParams(createRules, Object.assign({}, ctx.request.body))
    // todo how to find or create
    await this.contactService.create(params)
  }

  async delete () {
    const { ctx } = this
    const params = ctx.filterParams(deleteRules, Object.assign({}, ctx.params))
    await this.contactService.delete(params)
  }
}

module.exports = ContactController
