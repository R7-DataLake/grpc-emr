import Ajv from 'ajv';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { EmrModel } from '../models/emr';
import convertCamelCase from '../models/utils';

const grpc = require('@grpc/grpc-js');
const emrModel = new EmrModel();

import personSchema from '../schema/person';
import lastVisitSchema from '../schema/last_visit';

export class EmrHandler {

  async getPerson(ctx: any) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(personSchema);
    const valid = validate(ctx.req);

    if (valid) {
      const hospcode = ctx.req.hospcode;
      const hn = ctx.req.hn;
      const response: any = await emrModel.getPerson(hospcode, hn);
      if (response) {
        response.sex = response.sex === '1' ? 'ชาย' : 'หญิง';
        response.birth = DateTime.fromJSDate(response.birth, { zone: 'Asia/Bangkok' }).toFormat('yyyy-MM-dd');
        response.d_update = DateTime.fromJSDate(response.d_update, { zone: 'Asia/Bangkok' }).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);

        const data = convertCamelCase.camelizeKeys(response);
        ctx.res = data;
      } else {
        console.log('Not found')
        const err: any = new Error('DATA NOT FOUND')
        err.code = grpc.status.NOT_FOUND
        err.metadata = new grpc.Metadata()
        err.metadata.add('error', 'Patient info not found.');
        throw err
      }
    } else {
      const err: any = new Error('INVALID PARAMS')
      err.code = grpc.status.INTERNAL
      err.metadata = new grpc.Metadata()
      err.metadata.add('error', validate.errors);
      throw err
    }
  }

  async getLastOpd(ctx: any) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(lastVisitSchema);

    const valid = validate(ctx.req);

    if (valid) {
      const hospcode = ctx.req.hospcode;
      const hn = ctx.req.hn;
      const response: any = await emrModel.getLastOpd(hospcode, hn);
      if (!_.isEmpty(response)) {
        const _data: any = response.map((v: any) => {
          v.date_serv = DateTime.fromJSDate(v.date_serv, { zone: 'Asia/Bangkok' }).toFormat('yyyy-MM-dd');
          v.d_update = DateTime.fromJSDate(v.d_update, { zone: 'Asia/Bangkok' }).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
          return v;
        })
        const data = convertCamelCase.camelizeKeys(_data);
        ctx.res = {
          results: data
        };
      } else {
        console.log('Not found')
        const err: any = new Error('DATA NOT FOUND')
        err.code = grpc.status.NOT_FOUND
        err.metadata = new grpc.Metadata()
        err.metadata.add('error', 'Patient info not found.');
        throw err
      }
    } else {
      const err: any = new Error('INVALID PARAMS')
      err.code = grpc.status.INTERNAL
      err.metadata = new grpc.Metadata()
      err.metadata.add('error', validate.errors);
      throw err
    }
  }

  async getLastIpd(ctx: any) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(lastVisitSchema);

    const valid = validate(ctx.req);

    if (valid) {
      const hospcode = ctx.req.hospcode;
      const hn = ctx.req.hn;
      const response: any = await emrModel.getLastIpd(hospcode, hn);
      if (!_.isEmpty(response)) {
        const _data: any = response.map((v: any) => {
          v.dateadm = DateTime.fromJSDate(v.dateadm, { zone: 'Asia/Bangkok' }).toFormat('yyyy-MM-dd');
          v.datedsc = DateTime.fromJSDate(v.datedsc, { zone: 'Asia/Bangkok' }).toFormat('yyyy-MM-dd');
          v.d_update = DateTime.fromJSDate(v.d_update, { zone: 'Asia/Bangkok' }).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
          return v;
        })
        const data = convertCamelCase.camelizeKeys(_data);
        ctx.res = {
          results: data
        };
      } else {
        console.log('Not found')
        const err: any = new Error('DATA NOT FOUND')
        err.code = grpc.status.NOT_FOUND
        err.metadata = new grpc.Metadata()
        err.metadata.add('error', 'Patient info not found.');
        throw err
      }
    } else {
      const err: any = new Error('INVALID PARAMS')
      err.code = grpc.status.INTERNAL
      err.metadata = new grpc.Metadata()
      err.metadata.add('error', validate.errors);
      throw err
    }
  }

}