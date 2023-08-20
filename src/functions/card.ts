import container from '../container';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

const cardController: any = container.resolve('cardController');

const getByToken = cardController.getByToken;
const create = cardController.create;

export = {
  getByToken,
  create: middy(create).use(jsonBodyParser()),
};
