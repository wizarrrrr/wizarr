'use strict'

const pino = require('pino')
const { join } = require('path')

const transport = pino.transport({
  target: join(__dirname, '../../index.js'),
  level: 'info',
  options: {
    destination: parseInt(process.argv[2]),
    colorize: false,
    all: true
  }
})

const log = pino(transport)

log.info(require('./not-http-log.json'))
