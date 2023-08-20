import { createClient } from 'redis';
import config from '../config';
import { ICard } from '../services/repositories/domain/card.domain';
import { AppError, ERRORS } from '../common/error';

export default class RedisCacheService {
  private client: any;

  constructor() {
    this.client = createClient({
      url: config.REDISCLOUD_URL,
    });
  }

  async get(key: string) {
    try {
      await this.client.connect();
      const value = await this.client.get(key);
      await this.client.quit();
      return JSON.parse(value);
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  async set(key: string, value: ICard, ttl: number = 900) {
    try {
      await this.client.connect();
      const valueJson = JSON.stringify(value);

      if (ttl == -1) {
        await this.client.set(key, valueJson);
        await this.client.quit();
      } else {
        // EX (expiration) in seconds
        await this.client.set(key, valueJson, { EX: ttl });
        await this.client.quit();
      }
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  async del(key: string) {
    try {
      await this.client.connect();
      await this.client.del(key);
      await this.client.quit();
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }
}
