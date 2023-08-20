import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import CardService from '../services/card.service';

import { validateCard, VALIDATE_MODES } from './validators/card';
import { validateToken } from './validators/token';
import { getToken } from '../utils/token';
import { AppError, ERRORS } from '../common/error';
import { AppSuccess, SUCCESS } from '../common/success';

let _cardService: CardService;

export default class CardController {
  constructor({ cardService }: any) {
    _cardService = cardService;
  }

  public async getByToken(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const token = getToken(event.headers.Authorization);
      const response = validateToken({ token });
      if (!response.success) {
        return AppError(
          ERRORS.TOKEN_ERROR,
          'Invalid token',
          response.error.issues.map((x: any) => {
            return {
              key: x.path[0],
              message: x.message,
            };
          })
        );
      }

      const result = await _cardService.getByToken(token);
      if (result.statusCode >= 400 && result.statusCode <= 500) {
        return result;
      }

      return AppSuccess(SUCCESS.OBTAINED, 'Card data obtained', result);
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }

  public async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const response = validateCard(event.body, VALIDATE_MODES.STRICT);
      if (!response.success) {
        return AppError(
          ERRORS.PAYLOAD_ERROR,
          'Invalid payload',
          response.error.issues.map((x: any) => {
            return {
              key: x.path[0],
              message: x.message,
            };
          })
        );
      }

      const result = await _cardService.create(event.body);
      if (result.statusCode >= 400 && result.statusCode <= 500) {
        return result;
      }

      return AppSuccess(SUCCESS.CREATED, 'Card data created', result, 201);
    } catch (error) {
      console.log(error);
      return AppError(ERRORS.SERVER_ERROR, 'Internal server error', error, 500);
    }
  }
}
