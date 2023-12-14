'use strict'

const { pipeline, Transform } = require('stream')
const SonicBoom = require('sonic-boom')
const { prettyFactory } = require('pino-pretty')
const abstractTransport = require('pino-abstract-transport')
const { defaultOptions, format } = require('./utils')

module.exports = pinoTransport

function pinoTransport (options) {
  const opts = Object.assign({}, defaultOptions, options)
  const destination = getStream(opts.destination)

  let prettyPrinter
  if (opts.all === true) {
    prettyPrinter = prettyFactory(Object.assign({}, {
      colorize: opts.colorize,
      translateTime: opts.translateTime
    }, opts.prettyOptions))
  }

  return abstractTransport(function (source) {
    const stream = new Transform({
      objectMode: true,
      autoDestroy: true,
      transform (obj, enc, cb) {
        if (!obj.req || !obj.res) {
          // not an http log
          cb(null, opts.all === true ? prettyPrinter(obj) : null)
        } else {
          // http log
          const log = format(obj, opts)
          cb(null, log)
        }
      }
    })

    pipeline(source, stream, destination, () => {
      // process._rawDebug('pino-transport: finished piping')
    })
  })
}

function getStream (fileDescriptor) {
  if (fileDescriptor === 1 || !fileDescriptor) return process.stdout
  else if (fileDescriptor === 2) return process.stderr
  else return SonicBoom({ dest: fileDescriptor, sync: false })
}
