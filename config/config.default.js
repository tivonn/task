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
  username: 'task',
  password: 'taskgo',
  timezone: '+08:00',
  define: {
    freezeTableName: true
  },
}

exports.middleware = [
  'currentUser',
  'errorHandler'
]
