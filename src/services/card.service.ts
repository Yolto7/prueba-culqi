import CardRepository from './repositories/card.repository';
import RedisProviderService from './providers/redis.provider';

import { validateCardNumber } from '../utils/validateCardNumber';
import { createToken } from '../utils/token';
import { AppError, ERRORS } from '../common/error';

export default class CardService {
  private cardRepository: CardRepository;
  private redisProviderService: RedisProviderService;

  constructor({ cardRepository, redisProviderService }: any) {
    this.cardRepository = cardRepository;
    this.redisProviderService = redisProviderService;
  }

  async getByToken(token: string) {
    try {
      const cacheData = await this.redisProviderService.get('cards', token);
      if (!cacheData) {
        return AppError(ERRORS.NOT_FOUND, 'Card not found because the data expired.');
      }

      const { cvv, ...data } = cacheData;
      return data;
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  async create(entity: any) {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      today.setFullYear(today.getFullYear() + 5);

      if (parseInt(entity.expiration_year) < currentYear) {
        return AppError(
          ERRORS.PAYLOAD_ERROR,
          'Expiration year should cannot be less than the current year.'
        );
      }

      if (parseInt(entity.expiration_year) > today.getFullYear()) {
        return AppError(
          ERRORS.PAYLOAD_ERROR,
          'Expiration year should only be greather than 5 years.'
        );
      }

      if (!validateCardNumber(entity.card_number)) {
        return AppError(ERRORS.PAYLOAD_ERROR, 'Invalid card number.');
      }

      const token = createToken();
      await this.redisProviderService.create('cards', token, entity);
      const result: any = await this.cardRepository.create(entity);

      if (result?.statusCode >= 400 && result?.statusCode <= 500) {
        return result;
      } else {
        return { token };
      }
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }
}
