import http from './http';

export function get_wedding (success) {
  return http.get('/api/v0/my_wedding', { success });
}
