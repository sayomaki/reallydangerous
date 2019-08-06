'use strict'
const crypto = require('crypto');

const hashkey = (method, data) => { 
  return crypto.createHash(method).update(data).digest()
}

class HMACAlgorithm  {
  constructor (digest_method) {
    if (!digest_method) {
      throw Error('Missing digest method!');
    }
    this.digest_method = digest_method;
  }

  get_signature (key, value) {
    return crypto.createHmac(this.digest_method, key).update(value).digest();
  }

  verify_signature (key, value, sig) {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(this.get_signature(key, value)));
  }
}

class NoneAlgorithm {
  get_signature (digest_method, key, value) {
    return value;
  }

  verify_signature (key, value, sig) {
    return value === this.get_signature(key, value);
  }
}

const b64encode = (data) => {
  if (typeof data === 'number') {
    data = data.toString(16);
    data = data.length % 2 == 0 ? data : '0' + data;
    const enc = Buffer.from(data, 'hex').toString('base64');
    return enc.split('/').join('_').split('+').join('-').split('=').join('');
  }
  else {
    const enc = Buffer.from(data).toString('base64');
    return enc.split('/').join('_').split('+').join('-').split('=').join('');
  }
}

const b64decode = (data) => {
  data += '='.repeat(mod(-data%4 ,4));
  return Buffer.from(data, 'base64');
}

const mod = (n, m) => {
  return ((n * m) + m) % m;
}

module.exports = {
  HMACAlgorithm,
  NoneAlgorithm,
  hashkey,
  b64encode,
  b64decode
}