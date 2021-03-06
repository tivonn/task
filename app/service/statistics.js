'use strict'

const Service = require('egg').Service

const { TASK_STATUS } = require('../enum/task')

class StatisticsService extends Service {
  get taskModel () {
    return this.app.model.Task
  }

  async all () {
    const { ctx, app } = this
    const { Op } = app.Sequelize
    const unfinishedCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['unfinished'].value,
        [Op.or]: [{
          creatorId: ctx.state.currentUser.id
        },
          app.Sequelize.literal(`exists(select 1 from task_principal where principal_id = ${ctx.state.currentUser.id} and task_id = task.id)`),
          app.Sequelize.literal(`exists(select 1 from task_ccer where ccer_id = ${ctx.state.currentUser.id} and task_id = task.id)`)
        ]
      }
    })
    const principalCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['unfinished'].value
      },
      include: {
        model: app.model.TaskPrincipal,
        as: 'principal',
        where: {
          principalId: ctx.state.currentUser.id
        }
      }
    })
    const createCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['unfinished'].value,
        creatorId: ctx.state.currentUser.id
      }
    })
    const ccCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['unfinished'].value
      },
      include: {
        model: app.model.TaskCcer,
        as: 'ccer',
        where: {
          ccerId: ctx.state.currentUser.id
        }
      }
    })
    const delayCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['unfinished'].value,
        deadline: {
          [Op.lt]: new Date()
        },
        [Op.or]: [{
          creatorId: ctx.state.currentUser.id
        },
          app.Sequelize.literal(`exists(select 1 from task_principal where principal_id = ${ctx.state.currentUser.id} and task_id = task.id)`),
          app.Sequelize.literal(`exists(select 1 from task_ccer where ccer_id = ${ctx.state.currentUser.id} and task_id = task.id)`)
        ]
      }
    })
    const finishedCount = await this.taskModel.count({
      where: {
        status: TASK_STATUS['finished'].value,
        [Op.or]: [{
          creatorId: ctx.state.currentUser.id
        },
          app.Sequelize.literal(`exists(select 1 from task_principal where principal_id = ${ctx.state.currentUser.id} and task_id = task.id)`),
          app.Sequelize.literal(`exists(select 1 from task_ccer where ccer_id = ${ctx.state.currentUser.id} and task_id = task.id)`)
        ]
      }
    })
    const allStatistics = {
      unfinishedCount,
      principalCount,
      createCount,
      ccCount,
      delayCount,
      finishedCount
    }
    return allStatistics
  }

  async period () {
    // todo
    return []
  }
}

module.exports = StatisticsService
