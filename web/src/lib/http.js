function error (message, details) {
  var _error_message = "HTTP: " + (message || "Unknown Error");
  try {
    console.error(_error_message, details);
  } catch (e) {}
  throw new Error(_error_message);
}

function http_call (config) {
  var _config = $.extend({
    type: 'GET',
    contentType: "application/json",
    dataType: 'json',
  }, config || {});

  if (_config.url === undefined) {
    error("No url defined", _config);
  }

  return $.ajax(_config);
}

export function http_get (url, config) {
  return http_call($.extend((config || {}), { url: url }));
}

export function http_post (url, data, config) {
  return http_call($.extend((config || {}), {
    type: 'POST',
    url: url,
    data: JSON.stringify(data || {})
  }));
}

export function http_delete (url, config) {
  return http_call($.extend((config || {}), {
    type: 'DELETE',
    url: url,
  }));
}

export function http_post_form (url, config) {
  return http_call($.extend((config || {}), {
    type: 'POST',
    url: url,
    data: data,
    cache: false,
    dataType: 'json',
    processData: false,
    contentType: false,
  }));
}

export default {
  'get': http_get,
  'post': http_post,
  'delete': http_delete,
};
