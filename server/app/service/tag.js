'use strict'

const Service = require('egg').Service

class TagService extends Service {
  get tagModel () {
    return this.app.model.Tag
  }

  async index (params) {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    const { key } = params
    let where = key
      ?
      {
        name:
          {
            [Op.like]: `%${key}%`
          }
      }
      : {}
    where.creatorId = ctx.state.currentUser.id
    const tags = await this.tagModel.findAll({
      where,
      attributes: ['id', 'name']
    })
    return tags
  }

  async create (params) {
    const { ctx } = this
    const updateDefault = {
      creatorId: ctx.state.currentUser.id
    }
    const tag = await this.tagModel.create(Object.assign({}, params, updateDefault))
    return tag
  }

  async update (params) {
    const { ctx } = this
    const { id } = params
    const tag = await this.tagModel.findOne({
      where: {
        id
      }
    })
    if (!tag) {
      ctx.throw(404, '不存在该标签')
    }
    if (tag.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限更新')
    }
    await tag.update(params)
    return tag
  }

  async delete (params) {
    const { ctx } = this
    const { id } = params
    const tag = await this.tagModel.findOne({
      where: {
        id
      }
    })
    if (!tag) {
      ctx.throw(404, '不存在该标签')
    }
    if (tag.creatorId !== ctx.state.currentUser.id) {
      ctx.throw(403, '无权限删除')
    }
    await tag.destroy()
    ctx.status = 200
  }
}

module.exports = TagService
