import http from './http';

export function get_wedding (success) {
  return http.get('/api/v0/my_wedding', { success });
}

export function create_group (data, success) {
  return http.post('/api/v0/guest_list/create_group', data, { success });
}

export function delete_group (group_id, success) {
  return http.delete(`/api/v0/group/${group_id}`, { success });
}

export function create_guest (group_id, name, success) {
  return http.post(`/api/v0/guest_group/${group_id}/create_guest`, { name }, { success });
}

export function delete_guest (guest_id, success) {
  return http.delete(`/api/v0/guest/${guest_id}`, { success });
}

export function add_tag (guest_id, text, success) {
  return http.post(`/api/v0/guest/${guest_id}/add_tag`, { text }, { success });
}

export function remove_tag (guest_id, tag_id, success) {
  return http.post(`/api/v0/guest/${guest_id}/remove_tag/${tag_id}`, { success });
}

export function create_table (data, success) {
  return http.post(`/api/v0/layout/create_table`, data, { success });
}

export function delete_table (table_id, success) {
  return http.delete(`/api/v0/table/${table_id}`, { success });
}

export function create_lineage (success) {
  return http.get(`/api/v0/create_lineage`, { success });
}
