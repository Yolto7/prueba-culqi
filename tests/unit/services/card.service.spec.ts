import CardService from '../../../src/services/card.service';

describe('Card Service', () => {
  const cardRepository = { create: jest.fn() };
  const redisProviderService = { get: jest.fn(), create: jest.fn() };
  const cardService = new CardService({ cardRepository, redisProviderService });

  // mocks
  const responseGetMock = {
    email: 'mateo@hotmail.com',
    card_number: '5118420412887612',
    expiration_month: '02',
    expiration_year: '2024',
  };

  it('Should get card data', async () => {
    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5118420412887612',
      cvv: '212',
      expiration_month: '02',
      expiration_year: '2024',
    };
    jest.spyOn(redisProviderService, 'get').mockImplementation(async () => cardMock);

    const result = await cardService.getByToken('MH9mirQCBgD8kbYe');

    expect(result).toBeDefined();
    expect(result).toEqual(responseGetMock);
  });

  it('Should create card', async () => {
    jest.spyOn(redisProviderService, 'create').mockImplementation(async () => true);
    jest.spyOn(cardRepository, 'create').mockImplementation(async () => true);

    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5118420412887612',
      cvv: '212',
      expiration_month: '02',
      expiration_year: '2024',
    };
    const result = await cardService.create(cardMock);

    expect(result).toBeDefined();
  });

  it('Should return Card not found because the token expired', async () => {
    jest.spyOn(redisProviderService, 'get').mockImplementation(async () => null);

    const result: any = await cardService.getByToken('MH9mirQCBgD8kbYe');
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.body.errorCode).toBe('ERR_NOT_FOUND');
    expect(result.body.message).toBe('Card not found because the token expired.');
  });

  it('Should return Expiration year should cannot be less than the current year', async () => {
    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5118420412887612',
      cvv: '212',
      expiration_month: '02',
      expiration_year: '2022',
    };
    const result: any = await cardService.create(cardMock);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.body.errorCode).toBe('ERR_PAYLOAD_INVALID');
    expect(result.body.message).toBe(
      'Expiration year should cannot be less than the current year.'
    );
  });

  it('Should return Expiration year should only be greather than 5 years', async () => {
    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5118420412887612',
      cvv: '212',
      expiration_month: '02',
      expiration_year: '2029',
    };
    const result: any = await cardService.create(cardMock);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.body.errorCode).toBe('ERR_PAYLOAD_INVALID');
    expect(result.body.message).toBe('Expiration year should only be greather than 5 years.');
  });

  it('Should return Invalid card number', async () => {
    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5111420412887612',
      cvv: '212',
      expiration_month: '02',
      expiration_year: '2026',
    };
    const result: any = await cardService.create(cardMock);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.body.errorCode).toBe('ERR_PAYLOAD_INVALID');
    expect(result.body.message).toBe('Invalid card number.');
  });
});
