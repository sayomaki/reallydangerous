'use strict'
const utils = require('./utils');
const Signer = require('./signer');

class TimestampSigner extends Signer {
  constructor (secret_key, salt, sep='.', key_derivation, digest_method, algorithm) {
    super(...arguments);
    this.epoch = 0;
  }

  set_epoch (epoch) {
    epoch = parseInt(epoch);
    if (Number.isNaN(epoch)) throw Error ('BadEpoch: Epoch must be seconds after unix/POSIX epoch.');
    this.epoch = epoch;
  }
  
  get_epoch () {
    return this.epoch;
  }

  get_timestamp () {
    return parseInt((Date.now() / 1000 - this.epoch).toFixed(0));
  }

  timestamp_to_datetime (ts) {
    return new Date((ts + this.epoch) * 1000);
  }

  sign (value) {
    const timestamp = utils.b64encode(this.get_timestamp());
    value = value + this.sep + timestamp;
    return value + this.sep + this.get_signature(value);
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