import { ICard } from '../repositories/domain/card.domain';
import config from '../../config';
import { AppError, ERRORS } from '../../common/error';

const partitionKey = config.REDIS_PARTITION_KEY;

export default class RedisProviderService {
  private redisCacheService: any;

  constructor({ redisCacheService }: any) {
    this.redisCacheService = redisCacheService;
  }

  async get(partitionId: string, token: string) {
    try {
      const key = this.createKey(partitionId, token);
      const data = await this.redisCacheService.get(key);
      return data || null;
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  async create(partitionId: string, token: string, card: ICard) {
    try {
      const key = this.createKey(partitionId, token);
      await this.redisCacheService.set(key, card, 900);
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  private createKey(partitionId: string, token: string) {
    return `${partitionKey}${partitionId}${token}`;
  }
}
