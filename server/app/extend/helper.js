'use strict'

module.exports = {
  getArrayDiff (minuend, subtrahend) {
    return minuend.filter(item => !subtrahend.includes(item))
  }
}
