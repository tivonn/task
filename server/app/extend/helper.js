'use strict'

module.exports = {
  uniqueArray (array, key) {
    let map = {}
    return array.filter(item => {
      const id = key ? item[key] : item
      if (map[id]) return
      map[id] = true
      return item
    })
  }
}
