import { connectBD } from '../../database';
import { ICard } from './domain/card.domain';
import { AppError, ERRORS } from '../../common/error';

export default class CardRepository {
  private dbp: any;
  private pgp: any;

  constructor() {
    this.dbp;
    this.pgp;
  }

  async create(entity: ICard) {
    try {
      const dbEntity = {
        email: entity.email,
        card_number: entity.card_number,
        cvv: entity.cvv,
        expiration_month: entity.expiration_month,
        expiration_year: entity.expiration_year,
      };

      const result: any = await connectBD();
      this.dbp = result.dbp;
      this.pgp = result.pgp;

      let sql = `INSERT INTO public.cards(email, card_number, cvv, expiration_month, expiration_year)
                  VALUES ($1, $2, $3, $4, $5)`;
      sql = this.pgp.as.format(sql, [
        dbEntity.email,
        dbEntity.card_number,
        dbEntity.cvv,
        dbEntity.expiration_month,
        dbEntity.expiration_year,
      ]);
      await this.dbp.result(sql);
    } catch (error) {
      console.error(error);
      return AppError(ERRORS.DB_ERROR, 'Database is not available');
    }
  }
}
