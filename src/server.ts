const path = require('path')
const Mali = require('mali')
const jwt = require('jsonwebtoken')

import { EmrHandler } from "./handlers/emr"
import { StatusHandler } from "./handlers/status"

const secret = process.env.R7PLATFORM_GRPC_EMR_SECRET_KEY || ''

const emrHandler = new EmrHandler()
const statusHandler = new StatusHandler();

let app: any

const PROTO_PATH = path.join(__dirname, '../protos/emr.proto')

const HOSTPORT = '0.0.0.0:50052'

const verifyToken = (ctx: any, next: any) => {

  const authorization = ctx.request.metadata.authorization
  if (!authorization) {
    return ctx.res = new Error("authorization header is required")
  }

  const token = authorization.replace('Bearer ', '')

  try {
    ctx.user = jwt.verify(token, secret)
  } catch (err: any) {
    ctx.status = 401
    return ctx.res = new Error("Unauthorized")
  }

  return next()
}

const logger = async (ctx: any, next: any) => {
  const start = new Date()
  await next()
  const current = new Date()
  const ms = current.getTime() - start.getTime()
  console.log('%s [%s] - %s ms', ctx.name, ctx.type, ms)
}

const main = () => {
  app = new Mali(PROTO_PATH)

  app.on('error', (err: any, ctx: any) => {
    console.error('server error for call %s of type %s', ctx.name, ctx.type, err)
  })

  // Middleware
  // app.use(verifyToken)
  app.use(logger)

  // Services
  app.use('GetPerson', verifyToken, emrHandler.getPerson)
  app.use('GetLastOpd', verifyToken, emrHandler.getLastOpd)
  app.use('GetLastIpd', verifyToken, emrHandler.getLastIpd)
  app.use('GetOpdDiag', verifyToken, emrHandler.getOpdDiag)
  app.use('GetIpdDiag', verifyToken, emrHandler.getIpdDiag)
  app.use('GetOpdDrug', verifyToken, emrHandler.getOpdDrug)
  app.use('GetIpdDrug', verifyToken, emrHandler.getIpdDrug)
  app.use('GetOpdLab', verifyToken, emrHandler.getOpdLab)
  app.use('GetOpdInfo', verifyToken, emrHandler.getOpdInfo)
  app.use('GetIpdInfo', verifyToken, emrHandler.getIpdInfo)
  app.use('Status', statusHandler.status)

  // Start app
  app.start(HOSTPORT)
  console.log(`EMR service running at ${HOSTPORT}`)
}

const shutdown = async (err: any) => {
  if (err) console.error(err)
  await app.close()
  process.exit()
}

process.on('uncaughtException', shutdown)
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

main()