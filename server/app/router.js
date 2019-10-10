'use strict'

module.exports = app => {
  require('./router/user')(app)
  // require('./router/task_type')(app)
}
