'use strict'

const Controller = require('egg').Controller

class StatisticsController extends Controller {
  get statisticsService () {
    return this.ctx.service.statistics
  }

  async all () {
    const { ctx } = this
    const allStatistics = await this.statisticsService.all()
    ctx.body = allStatistics
  }

  async period () {
    const { ctx } = this
    const periodStatistics = await this.statisticsService.period()
    ctx.body = periodStatistics
  }
}

module.exports = StatisticsController
