#!/usr/bin/env node
const args = require('args')
const { httpPrintFactory } = require('./')

args
  .option(['a', 'all'], 'Handle all log messages, not just HTTP request/response logs')
  .option(['c', 'colorize'], 'Force adding color sequences to the output')
  .option(['t', 'translateTime'], 'Display epoch timestamps as UTC ISO format or according to an optional format string (default ISO 8601)')
  .option(['r', 'relativeUrl'], 'Display relative urls instead of full urls')
  .option(['x', 'lax'], 'Discard invalid JSON instead of throwing')

args
  .example('cat log | pino-http-print', 'To prettify only HTTP logs, simply pipe a log file through')
  .example('cat log | pino-http-print -a', 'To prettify both HTTP and non-HTTP log messages use the -a option')
  .example('cat log | pino-http-print -t', 'To convert Epoch timestamps to ISO timestamps use the -t option')
  .example('cat log | pino-http-print -t "SYS:yyyy-mm-dd HH:MM:ss"', 'To convert Epoch timestamps to local timezone format use the -t option with "SYS:" prefixed format string')
  .example('cat log | pino-http-print -r', 'To print relative urls in HTTP logs use the -r option')
  .example('cat log | pino-http-print -x', 'When non-JSON can reach stdout use -x to silently discard it')

const opts = args.parse(process.argv)
const printer = httpPrintFactory(opts)

process.stdin.pipe(printer())
