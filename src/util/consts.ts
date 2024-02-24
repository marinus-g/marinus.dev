export const BACKEND = 'ADDRESS';
export enum END_POINT {
  DNS_RESOLVE = '/api/v1/public/dns/',
  WEATHER = '/api/v1/public/weather',
  AUTHENTICATE = '/api/v1/public/authentication/authenticate',
  CONTENT_PROFILE = '/api/v1/content/profile',
  CONTENT_PROFILE_TOKEN = '/api/v1/content/profile/{profile}/token',
  CONTENT_PROFILE_ADD_CONTENT = '/api/v1/content/profile/{profile}/content/{content}',
  CONTENT_FETCH = '/api/v1/content/fetch/',
  CONTENT_FETCH_ALL = '/api/v1/content/fetch/all',
  DEFAULT_CONTENT = '/api/v1/content/default',
  USER_EXISTS = '/api/v1/public/user/{username}/exists',
  CURRENT_USER = '/api/v1/user',
  CONTENT_CREATE = '/api/v1/content/',
  CONTENT_PROFILE_FETCH_ALL = "/api/v1/content/profile/all",

  CREATE_PROJECT_TAG = '/api/v1/project/tag',
}
