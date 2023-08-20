import CardController from '../../../src/controllers/card.controller';

describe('Card Controller', () => {
  const cardService = { create: jest.fn(), getByToken: jest.fn() };
  const cardController = new CardController({ cardService });

  it('Should get card data', async () => {
    const cardMock = {
      email: 'mateo@hotmail.com',
      card_number: '5118420412887612',
      expiration_month: '02',
      expiration_year: '2024',
    };
    jest.spyOn(cardService, 'getByToken').mockImplementation(async () => cardMock);

    const payload: any = {
      headers: {
        Authorization: 'Bearer MH9mirQCBgD8kbYe',
      },
    };
    const result: any = await cardController.getByToken(payload);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
    expect(result.body.code).toBe('OK_OBTAINED');
  });

  it('Should create card', async () => {
    jest.spyOn(cardService, 'create').mockImplementation(async () => 'yKRe2gRXXHjPx5S4');

    const payload: any = {
      body: {
        email: 'mateo@hotmail.com',
        card_number: '5118420412887612',
        expiration_month: '02',
        expiration_year: '2024',
        cvv: '123',
      },
    };
    const result: any = await cardController.create(payload);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
    expect(result.body.code).toBe('OK_CREATED');
  });

  it('Should return Invalid token', async () => {
    const payload: any = {
      headers: {
        Authorization: 'Bearer a',
      },
    };
    const result: any = await cardController.getByToken(payload);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(400);
    expect(result.body.errorCode).toBe('ERR_TOKEN_INVALID');
  });

  it('Should return Invalid payload', async () => {
    const payload: any = {
      body: {
        email: 'mateo@hotmail.com',
        card_number: '5118420412887612',
        expiration_month: '02',
        expiration_year: '2024',
        cvv: 123,
      },
    };
    const result: any = await cardController.create(payload);
    result.body = JSON.parse(result.body);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(400);
    expect(result.body.errorCode).toBe('ERR_PAYLOAD_INVALID');
  });
});
