export const BACKEND = 'http://localhost:8080';
export enum END_POINT {
  DNS_RESOLVE = BACKEND + '/api/v1/public/dns/',
  WEATHER = BACKEND + '/api/v1/public/weather',
  AUTHENTICATE = BACKEND + '/api/v1/public/authentication/authenticate',
  CONTENT_PROFILE = BACKEND + '/api/v1/content/profile',
  CONTENT_FETCH = BACKEND + '/api/v1/content/fetch',
}