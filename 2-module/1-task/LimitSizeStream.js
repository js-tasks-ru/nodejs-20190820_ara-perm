const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit || 2 ** 16;
    this._bufferSize = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this._bufferSize + chunk.length <= this._limit) {
      
      this._bufferSize += chunk.length;
      callback(null, chunk);
    } else
    {
      callback(new LimitExceededError);
    }
  }
}

module.exports = LimitSizeStream;
