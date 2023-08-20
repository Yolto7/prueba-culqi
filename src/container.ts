import { createContainer, asClass } from 'awilix';

// Setting app
import RedisCacheService from './utils/redis';

// Repositories
import CardRepository from './services/repositories/card.repository';

// Providers
import RedisProviderService from './services/providers/redis.provider';

// Services
import CardService from './services/card.service';

// Controllers
import CardController from './controllers/card.controller';

const container = createContainer();

container
  .register({
    cardRepository: asClass(CardRepository).singleton(),
  })
  .register({
    redisCacheService: asClass(RedisCacheService).singleton(),
  })
  .register({
    redisProviderService: asClass(RedisProviderService).singleton(),
  })
  .register({
    cardService: asClass(CardService).singleton(),
  })
  .register({
    cardController: asClass(CardController.bind(CardController)).singleton(),
  });

export default container;
