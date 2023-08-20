import RandExp from 'randexp';

export function getToken(bearerToken: string | undefined) {
  return bearerToken?.split(' ')[1] || '';
}

export function createToken() {
  return new RandExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([A-Za-z0-9]){16}$/).gen();
}
