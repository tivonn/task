'use strict'

exports.keys = 'task'

exports.mysql = {
  client: {
    host: 'localhost',
    port: '3306',
    user: 'task',
    password: 'taskgo',
    database: 'task'
  }
}

exports.sequelize = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'task',
  timezone: '+08:00'
}
