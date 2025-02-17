'use strict'

const colorette = require('colorette')
const { prettifyTime } = require('pino-pretty/lib/utils')
const prettyMs = require('pretty-ms')

const status_colored = {
    default: colorette.white,
    50: colorette.bgRed,
    40: colorette.red,
    30: colorette.yellow,
    20: colorette.green,
    10: colorette.blue,
}

const method_colored = {
    default: colorette.gray,
    GET: colorette.green,
    POST: colorette.yellow,
    PUT: colorette.blue,
    DELETE: colorette.red,
    PATCH: colorette.magenta,
    HEAD: colorette.cyan
}
/**
 * @typedef {Object} HttpPrintOptions
 * @property {boolean} [all] support all log messages, not just HTTP logs
 * @property {boolean} [colorize] colorize logs, default is automatically set by colorette.isColorSupported
 * @property {boolean|string} [translateTime] (default: false) When `true` the timestamp will be prettified into a string,
 *  When false the epoch time will be printed, other valid options are same as for `pino-pretty`
 * @property {boolean} [relativeUrl] (default: false)
 * @property {boolean} [lax] (default: false) When `true` the JSON parser will silently discard unparseable logs, e.g.
 * from nodemon
 */

/** @type {HttpPrintOptions} */
const defaultOptions = {
    colorize: colorette.isColorSupported,
    translateTime: false,
    relativeUrl: false,
    all: false,
    lax: false
}

/**
 * @param {any} o
 * @param {HttpPrintOptions} opts
 */

function format(o, opts) {
    const time = prettifyTime({ log: o, translateFormat: opts.translateTime })
    const url = (opts.relativeUrl ? '' : ('http://' + o.req.headers.host)) + o.req.url
    const responseTime = prettyMs(o.responseTime)

    if (!opts.colorize) {
        return time + ' ' + o.req.method + ' ' + url + ' ' + o.res.statusCode + ' ' + responseTime + '\n'
    }

    const statusColor = status_colored[Math.floor(o.res.statusCode / 100) * 10] || status_colored.default
    const methodColor = method_colored[o.req.method] || method_colored.default
    return time + ' ' + methodColor(o.req.method) + ' ' +
        url + ' ' + statusColor(o.res.statusCode) + ' ' + responseTime + '\n'
}

module.exports = {
    defaultOptions,
    format
}
