const grpc = require('@grpc/grpc-js');

export class StatusHandler {

  async status(ctx: any) {
    try {
      ctx.res = { ok: true, version: '1.0.0' }
    } catch (error: any) {
      console.error(error)
      const code = grpc.status.INTERNAL
      const message = error.message
      ctx.status = code
      const err: any = new Error(message)
      err.code = grpc.status.INTERNAL
      throw err;
    }
  }
}