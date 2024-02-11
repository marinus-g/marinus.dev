export const BACKEND = 'ADDRESS';
export enum END_POINT {
  DNS_RESOLVE = '/api/v1/public/dns/',
  WEATHER = '/api/v1/public/weather',
  AUTHENTICATE = '/api/v1/public/authentication/authenticate',
  CONTENT_PROFILE = '/api/v1/content/profile',
  CONTENT_FETCH = '/api/v1/content/fetch',
  DEFAULT_CONTENT = '/api/v1/content/default',
  USER_EXISTS = '/api/v1/public/user/{username}/exists',
  CURRENT_USER = '/api/v1/user',
}
