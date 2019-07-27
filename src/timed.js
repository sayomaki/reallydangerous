'use strict'
const utils = require('./utils');
const Signer = require('./signer');

class TimestampSigner extends Signer {
  get_timestamp () {
    return parseInt((Date.now() / 1000).toFixed(0));
  }

  timestamp_to_datetime (ts) {
    return new Date(ts * 1000);
  }

  sign (value) {
    const timestamp = utils.b64encode(this.get_timestamp());
    const sep = this.sep;
    value = value + sep + timestamp;
    return value + sep + this.get_signature(value);
  }

  unsign (value, max_age, return_timestamp=false) {
    let sig_error, result = '', timestamp;
    try {
      result = super.unsign(value);
    }
    catch (e) {
      sig_error = e;
    }
    const sep = this.sep.toString();
    
    if (!result.includes(sep)) {
      if (sig_error) throw Error (sig_error);
      throw Error('BadTimeSignature: Timestamp missing.');
    }

    result = result.split(sep);
    timestamp = result.pop();
    value = result.join(sep);

    try {
      timestamp = parseInt(utils.b64decode(timestamp).toString('hex'), 16);
    }
    catch (e) {

    }

    if (sig_error) throw Error (sig_error);
    if (!timestamp || Number.isNaN(timestamp)) throw Error ('BadTimeSignature: Malformed timestamp.');

    if (max_age && max_age > 0) {
      const age = this.get_timestamp() - timestamp;
      if (age > max_age) throw Error ('BadTimeSignature: Signature age ' + age + ' > ' + max_age + ' seconds');
    }

    if (return_timestamp) return [value, timestamp];
    return value;
  }
}

module.exports = TimestampSigner;