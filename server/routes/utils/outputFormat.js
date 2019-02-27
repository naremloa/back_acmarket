const outputSuccess = (data, msg = 'Success', code = 0) => ({ code, msg, data });

const outputError = (msg = '', code = -1, data) => ({ code, msg, data });

const formatTryCatch = promise => promise
  .then(data => [null, data])
  .catch(err => [err, undefined]);

module.exports = {
  outputSuccess,
  outputError,
  formatTryCatch,
};
