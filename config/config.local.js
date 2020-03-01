'use strict'

exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true
}

exports.security = {
  csrf: {
    enable: false
  }
}
