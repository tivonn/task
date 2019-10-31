'use strict'

const Controller = require('egg').Controller

class TestController extends Controller {
  // 用于测试一些特定数据
  async index () {
    const { ctx } = this
    ctx.body = 'hello world'
  }
}

module.exports = TestController
