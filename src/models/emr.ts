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
        .orderByRaw('o.date_serv desc, o.time_serv desc')
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
        .orderByRaw('i.datedsc desc, i.timedsc desc')
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
          'o.hn',
          'o.seq',
          'o.datedx',
          'o.diag',
          'it.description as diag_name',
          'dt.name as dxtype',
          'o.d_update'
        )
        .leftJoin('libs.icd10tm as it', 'it.code', 'o.diag')
        .leftJoin('libs.diag_types as dt', 'dt.code', 'o.dxtype')
        .where('o.hospcode', hospcode)
        .where('o.seq', seq)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getIpdDiag(hospcode: any, an: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.ipdx as i')
        .select(
          'i.hospcode',
          'i.hn',
          'i.an',
          'i.diag',
          'it.description as diag_name',
          'dt.name as dxtype',
          'i.d_update'
        )
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'i.hospcode')
        .leftJoin('libs.icd10tm as it', 'it.code', 'i.diag')
        .leftJoin('libs.diag_types as dt', 'dt.code', 'i.dxtype')
        .where('i.hospcode', hospcode)
        .where('i.an', an)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getOpdDrug(hospcode: any, seq: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.opdrug as o')
        .select(
          'o.hospcode',
          'o.hn',
          'o.seq',
          'o.did',
          'd.name as drug_name',
          'o.amount',
          'o.unit',
          'o.unit_pack',
          'o.drugprice',
          'o.drugcost',
          'du.usage1',
          'du.usage2',
          'du.usage3',
          'o.d_update'
        )
        .innerJoin('libs.drugs as d', 'd.code', 'o.did')
        .joinRaw(`
          left join libs.drug_usages du on
          du.code = o.sigcode
          and du.hospcode = o.hospcode
        `)
        .where('o.hospcode', hospcode)
        .where('o.seq', seq)
        .orderBy('d.name')
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getIpdDrug(hospcode: any, an: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.ipdrug as i')
        .select(
          'i.hospcode',
          'i.hn',
          'i.an',
          'i.did',
          'd.name as drug_name',
          'i.amount',
          'i.unit',
          'i.unit_pack',
          'i.drugprice',
          'i.drugcost',
          'du.usage1',
          'du.usage2',
          'du.usage3',
          'i.d_update'
        )
        .innerJoin('libs.drugs as d', 'd.code', 'i.did')
        .joinRaw(`
          left join libs.drug_usages du on
          du.code = i.sigcode
          and du.hospcode = i.hospcode
        `)
        .where('i.hospcode', hospcode)
        .where('i.an', an)
        .orderBy('d.name')
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getOpdLab(hospcode: any, seq: any): Promise<any> {
    const db: Knex = await getConnection();
    return new Promise((resolve: any, reject: any) => {
      db('rawdata.lab as l')
        .select(
          'l.hospcode',
          'l.hn',
          'l.seq',
          'l.labtest',
          'l2.name as lab_name',
          'lg.name as lab_group_name',
          'l.labresult',
          'l.d_update'
        )
        .joinRaw(`
          left join libs.labs l2 on
          l2.code = l.labtest
          and l2.hospcode = l.hospcode
        `)
        .joinRaw(`
        left join libs.lab_groups lg on
        lg.code = l2.lab_group_code
        and lg.hospcode = l2.hospcode
        `)
        .where('l.hospcode', hospcode)
        .where('l.seq', seq)
        .orderBy('l2.name')
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getOpdInfo(hospcode: any, seq: any): Promise<any> {
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
        .where('o.seq', seq)
        .first()
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

  async getIpdInfo(hospcode: any, an: any): Promise<any> {
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
        .where('i.an', an)
        .first()
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

}