'use strict'

const t = require('tap')
const os = require('os')
const fs = require('fs')
const { spawnSync } = require('child_process')
const { join } = require('path')
const { once } = require('events')
const { promisify } = require('util')
const pino = require('pino')

const logHttp = require('./fixtures/http-log.json')

const timeout = promisify(setTimeout)

t.test('http-print pino transport test', async t => {
  const destination = join(
    os.tmpdir(),
    'pino-transport-test.log'
  )

  const fd = fs.openSync(destination, 'w+')
  const options = {
    destination: fd,
    all: false,
    colorize: false,
    translateTime: true
  }

  const transport = pino.transport({
    target: join(__dirname, '../index.js'),
    level: 'info',
    options
  })
  const log = pino(transport)
  t.pass('built pino')
  await once(transport, 'ready')
  t.pass('transport ready ' + destination)

  log.info(logHttp)
  log.info('this is just some raw text')
  log.debug(logHttp)
  log.flush()

  await timeout(1000)

  const data = fs.readFileSync(destination, 'utf8')
  t.equal(data.trim(), '[2016-07-21 17:34:52.244 +0000] GET http://localhost:20000/api/activity/component 200 17ms')
})

t.test('http-print pino transport test stdout', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '1'], {
    cwd: process.cwd()
  })
  t.equal(result.status, 0)
  t.equal(result.stdout.toString().trim(), '[1557721475837] INFO (48079 on MacBook-Pro-4): This is not a request/response log\n    v: 1')
})

t.test('http-print pino transport test stderr', async t => {
  const result = spawnSync('node', [join(__dirname, 'fixtures', 'log-stdout.js'), '2'], {
    cwd: process.cwd()
  })
  t.equal(result.status, 0)
  t.equal(result.stderr.toString().trim(), '[1557721475837] INFO (48079 on MacBook-Pro-4): This is not a request/response log\n    v: 1')
})
