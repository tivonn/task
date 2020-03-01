'use strict'

module.exports = app => {
  // 自定义枚举校验规则
  const addValidateRule = () => {
    app.validator.addRule('intEnum', (rule, value) => {
      const enumArray = Object.keys(rule.enum).map(key => rule.enum[key].value)
      if (!enumArray.includes(value)) {
        return '对应的枚举不存在'
      }
    })
  }

  app.beforeStart(async () => {
    addValidateRule()

    await app.model.sync()
    // await app.model.sync({ force: true})
  })
}
