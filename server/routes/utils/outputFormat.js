const outputSuccess = (data, msg = 'Success', code = 0) => ({ code, msg, data });

const outputError = (msg = '', code = -1, data) => ({ code, msg, data });

module.exports = {
  outputSuccess,
  outputError,
};
