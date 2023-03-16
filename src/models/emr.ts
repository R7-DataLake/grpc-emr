import { Knex } from 'knex';
import getConnection from "../db/connection";

export class EmrModel {

  async getPerson(hospcode: any, hn: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.person as p')
        .select(
          'p.hospcode',
          'h.hospname',
          'p.hn',
          'p.cid',
          'p.title',
          'p.fname',
          'p.lname',
          'p.birth',
          'p.sex',
          'm.name as marriage',
          'c.name as occupation',
          'n.name as nation',
          't.name as typearea',
          'p.d_update')
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'p.hospcode')
        .joinRaw('left join libs.nations as n on n.code=p.nation and n.hospcode=p.hospcode')
        .joinRaw('left join libs.occupations as c on c.code=p.occupation and c.hospcode=p.hospcode')
        .joinRaw('left join libs.marriages as m on m.code=p.marriage')
        .joinRaw('left join libs.typeareas as t on t.code=p.typearea')
        .where('p.hospcode', hospcode)
        .where('p.hn', hn)
        .limit(1)
        .first()
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getLastOpd(hospcode: any, hn: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.opd as o')
        .select(
          'o.hospcode',
          'h.hospname',
          'o.hn',
          'o.date_serv',
          'o.time_serv',
          'o.seq',
          'o.chiefcomp',
          'o.btemp',
          'o.sbp',
          'o.dbp',
          'o.pr',
          'o.rr',
          'o.ins_type',
          'i.name as ins_type_name',
          'o.ins_number',
          'o.ins_hospmain',
          'hm.hospname as ins_hospmain_name',
          'o.ins_hospsub',
          'hs.hospname as ins_hospsub_name',
          'o.diag_text',
          'o.d_update'
        )
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'o.hospcode')
        .leftJoin('libs.hospitals as hm', 'hm.hospcode', 'o.ins_hospmain')
        .leftJoin('libs.hospitals as hs', 'hs.hospcode', 'o.ins_hospsub')
        .joinRaw('left join libs.insurances as i on i.code=o.ins_type and i.hospcode=o.hospcode')
        .where('o.hospcode', hospcode)
        .where('o.hn', hn)
        .whereRaw(`
        exists (
          select dx.seq 
          from rawdata.opdx as dx 
          where dx.seq = o.seq
          and dx.hospcode = o.hospcode
          and dx.dxtype = '1'
          and left(dx.diag, 1) <> 'Z'
        ) `)
        .limit(10)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getLastIpd(hospcode: any, hn: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.ipd as i')
        .select(
          'i.hospcode',
          'h.hospname',
          'i.an',
          'i.hn',
          'i.dateadm',
          'i.timeadm',
          'i.datedsc',
          'i.timedsc',
          'ds.name as dischs',
          'dt.name as discht',
          'i.d_update'
        )
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'i.hospcode')
        .leftJoin('libs.dischs as ds', 'ds.code', 'i.dischs')
        .leftJoin('libs.discht as dt', 'dt.code', 'i.discht')
        .where('i.hospcode', hospcode)
        .where('i.hn', hn)
        .limit(10)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getOpdDiag(hospcode: any, seq: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.opdx as o')
        .select(
          'o.hospcode',
          'h.hospname',
          'o.hn',
          'o.seq',
          'o.datedx',
          'o.diag',
          'it.description as diag_name',
          'dt.name as dxtype',
          'o.provider',
          'o.d_update'
        )
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'o.hospcode')
        .leftJoin('libs.icd10tm as it', 'it.code', 'o.diag')
        .leftJoin('libs.diag_types as dt', 'dt.code', 'o.dxtype')
        .where('o.hospcode', hospcode)
        .where('o.seq', seq)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

}