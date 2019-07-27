'use strict'
const crypto = require('crypto');
const utils = require('./utils');

class Signer {
  constructor (secret_key, salt, sep='.', key_derivation, digest_method, algorithm) {

    this.default_digest_method = 'sha1';
    this.default_key_derivation = 'django-concat';

    this.secret_key = Buffer.from(secret_key);
    
    if (sep.match(/[A-Za-z-_=]/)) {
      throw Error ('The given separator cannot be used because it may be contained in the signature itself. Alphanumeric characters and `-_=` must not be used.');
    }

    this.sep = Buffer.from(sep);

    this.salt = salt || 'itsdangerous.Signer';

    this.key_derivation = key_derivation || this.default_key_derivation;

    this.digest_method = digest_method || this.default_digest_method;

    this.algorithm = algorithm || new utils.HMACAlgorithm(this.digest_method);
  }

  derive_key () {
    const salt = Buffer.from(this.salt);

    if (this.key_derivation === 'concat') {
      return utils.hashlib[this.digest_method](Buffer.concat([salt, this.secret_key]));
    }
    else if (this.key_derivation === 'django-concat') {
      return utils.hashlib[this.digest_method](Buffer.concat([salt, Buffer.from("signer"), this.secret_key]));
    }
    else if (this.key_derivation === 'hmac') {
      return crypto.createHmac(this.digest_method, this.secret_key).update(salt).digest();
    }
    else if (this.key_derivation === 'none') {
      return this.secret_key;
    }
    else {
      throw Error ('Unknown key derivation method');
    }
  }

  get_signature (value) {
    value = Buffer.from(value);
    const key = this.derive_key();
    const sig = this.algorithm.get_signature(key, value);
    return utils.b64encode(sig);
  }

  sign (value) {
    return value + this.sep + this.get_signature(value);
  }

  verify_signature (value, sig) {
    const key = this.derive_key();
    try {
      sig = utils.b64decode(sig);
      return this.algorithm.verify_signature(key, value, sig);
    }
    catch (e) {
      return false;
    }
  }

  unsign (signed_value) {
    const sep = this.sep.toString();
    if (!signed_value.includes(sep)) {
      throw Error ('BadSignature: No ' + sep + ' found in value.');
    }
    signed_value = signed_value.split(sep);
    const sig = signed_value.pop();
    const value = signed_value.join(sep);
    if (this.verify_signature(value, sig)) return value;
    throw Error ('BadSignature: Signature ' + sig + ' does not match');
  }

  validate (signed_value) {
    try {
      this.unsign(signed_value);
      return true;
    }
    catch (e) {
      return false;
    }
  }
}

module.exports = Signer;