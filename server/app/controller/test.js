'use strict'

const Controller = require('egg').Controller

class TestController extends Controller {
  // 用于测试一些特定数据
  async index () {
    const { ctx, app } = this
    const { model } = app
    // const post = await this.app.model.Post.findOne({
    //   where: {
    //     id: 1
    //   }
    // })
    // const tes = await this.app.model.Te.findAll({
    //   where: {
    //     id: [1]
    //   }
    // })
    // post.setK(tes)
    const task = await this.app.model.Task.findOne({
      where: {
        id: 1
      }
    })
    const principals = await this.app.model.User.findAll({
      where: {
        id: [2,4]
      }
    })
    console.log(principals)
    task.setPrincipals([1])
    ctx.body = 'hello world'
  }
}

module.exports = TestController
