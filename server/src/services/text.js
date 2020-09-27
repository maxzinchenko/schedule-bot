const toUpperCase = string => string.charAt(0).toUpperCase() + string.slice(1);

const toQuery = data => Object.keys(data).map(key => [key, data[key]].map(item => item).join('=')).join('&');

module.exports = { toUpperCase, toQuery };
