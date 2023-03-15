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
          'p.marriage',
          'c.name as occupation',
          'n.name as nation',
          'p.typearea',
          'p.d_update')
        .innerJoin('libs.hospitals as h', 'h.hospcode', 'p.hospcode')
        .joinRaw('left join libs.nations as n on n.code=p.nation and n.hospcode=p.hospcode')
        .joinRaw('libs.occupations as c on c.code=p.occupation and c.hospcode=p.hospcode')
        .where('p.hospcode', hospcode)
        .where('p.hn', hn)
        .limit(1)
        .first()
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());

    });
  }

  async getLastVisit(hospcode: any, hn: any): Promise<any> {
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
        .limit(10)
        .then((result: any) => resolve(result))
        .catch((error: any) => reject(error))
        .finally(async () => await db.destroy());
    });
  }

}