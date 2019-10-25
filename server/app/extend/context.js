'use strict'

module.exports = {
  filterParams (rules, params) {
    // 预处理参数
    let newParams = {}
    for (const key in params) {
      if (!rules.hasOwnProperty(key)) continue
      // 类型转换
      let value = params[key]
      if (typeof value === 'string') {
        // number类型
        switch (rules[key].type) {
          case 'number':
            value = Number(value)
            break
          case 'boolean':
            value = value !== 'false'
            break
        }
      }
      newParams[key] = value
    }
    // 校验参数
    const errors = this.app.validator.validate(rules, newParams)
    if (errors) {
      const error = errors[0]
      this.throw(422, `${error.field} ${error.message}`)
    }
    return newParams
  }
}
