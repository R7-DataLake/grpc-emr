import _ from 'lodash';

import { EmrModel } from '../models/emr';
import convertCamelCase from '../models/utils';

const grpc = require('@grpc/grpc-js');
const emrModel = new EmrModel();

export class EmrHandler {

  async getPerson(ctx: any) {
    try {
      const hospcode = ctx.req.hospcode;
      const hn = ctx.req.hn;
      const response: any = await emrModel.getPerson(hospcode, hn);
      const data = convertCamelCase.camelizeKeys(response);
      ctx.res = { data };
    } catch (error) {
      console.error(error)
      const code = grpc.status.INTERNAL;
      const message = "INTERNAL ERROR";
      ctx.status = code;
      return ctx.res = new Error(message);
    }
  }

}