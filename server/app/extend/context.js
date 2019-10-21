'use strict'

module.exports = {
  filterParams (rules, params) {
    // 校验参数
    const errors = this.app.validator.validate(rules, params)
    if (errors) {
      const error = errors[0]
      this.throw(422, `${error.field} ${error.message}`)
    }
    // 提取参数
    let newParams = {}
    for (let param in params) {
      if (rules.hasOwnProperty(param)) {
        newParams[param] = params[param]
      }
    }
    return newParams
  }
}
