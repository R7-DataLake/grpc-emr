import { Knex } from 'knex';
import getConnection from "../db/connection";

export class EmrModel {

  async getPerson(hospcode: any, hn: any): Promise<any> {
    const db: Knex = await getConnection()
    return db('person as p')
      .select(
        'p.hospcode',
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
      .joinRaw('left join libs.nations as n on n.code=p.nation and n.hospcode=p.hospcode')
      .joinRaw('libs.occupations as c on c.code=p.occupation and c.hospcode=p.hospcode')
      .where('p.hospcode', hospcode)
      .where('p.hn', hn)
      .limit(1)
      .first();
  }

}