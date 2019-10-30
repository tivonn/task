'use strict'

const Controller = require('egg').Controller

class TestController extends Controller {
  async index () {
    const { ctx } = this
    let newTask = await this.app.model.Task.create({name: 'name1', status: 10, taskTypeId: 1, creatorId: 1})
    let tags = await this.app.model.Tag.findAll(
      {
        where: {
          id: [1]
        }
      })//找到对应的tagId对象
    await newTask.setTags(tags)
    ctx.body = 'hello world'
  }
}

module.exports = TestController
