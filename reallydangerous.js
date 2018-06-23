const crypto = require('crypto')
const format = require('util').format

class ReallyDangerous {
 /**
   * @param {string} secret Secret for token
   * @param {Array} opts Options
   */
  constructor (secret, opts) {
    /**
     * Secret string
     * @type {string}
     */
    this.secret = secret

    /**
     * Epoch time to be used (in seconds)
     * Defaults to 1293840000 (2011/01/01 in UTC)
     * @type {number}
     */
    this.EPOCH = (opts && opts.EPOCH) || 1293840000

    /**
     * Salt used for HMAC digest
     * Defaults to 'itsDangerous'
     * @type {string}
     */
    this.salt = (opts && opts.salt) || 'itsDangerous'

    /**
     * Seperator for token
     * Defaults to '.'
     * @type {string}
     */
    this.sep = (opts && opts.sep) || '.'

    /**
     * HMAC Digest Method
     * Defaults to 'sha1'
     * @type {string}
     */
    this.digestMethod = (opts && opts.digestMethod) || 'sha1'

    this.algorithm = hmacAlgorithm(this.digestMethod)
  }

  /**
   * Signs the data
   * @param {string} value Data to be signed
   * @return {string} Signed data
   */
  sign (value) {
    return format('%s%s%s', value, this.sep, signature(this.algorithm, this.secret, this.salt, value))
  }

  /**
   * Unsigns the data and verifies it
   * @param {string} data Data to be unsigned
   * @return {string} Original data
   */
  unsign (data) {
    const tuple = rsplit(data, this.sep)

    const val = tuple[0]
    const sig = tuple[1]

    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(signature(this.algorithm, this.secret, this.salt, val)))) {
      return val
    }

    fail('BadSignature: Signature appears to be tampered with')
  }
}

class TimestampSigner extends ReallyDangerous {
  /**
   * Signs the data
   * @param {string} value Data to be signed
   * @return {string} Signed data
   */
  sign (data) {
    const timestamp = b64encodeInt(Date.now() - this.EPOCH)
    const value = format('%s%s%s', data, this.sep, timestamp)

    return super.sign(value)
  }

  /**
   * Unsigns the data and verifies it
   * @param {string} data Data to be unsigned
   * @param {number} maxAge Maximum duration of signed data
   * @return {string} Original data
   */
  unsign (data, maxAge) {

    maxAge = maxAge || null

    const unsigned = super.unsign(data)

    const tuple = rsplit(unsigned, this.sep)

    const val = tuple[0]
    const ts = tuple[1]

    const timestamp = b64decodeInt(ts)

    const age = (Date.now() - this.EPOCH) - timestamp

    if (maxAge && age > maxAge) {
      fail('BadSignature: Signature Expired')
    }

    return val
  }

  /**
   * Fetch timestamp of signed data
   * @param {string} data Signed data
   * @return {number} Timestamp of signature
   */
  timestamp (data) {
    const unsigned = super.unsign(data)

    const tuple = rsplit(unsigned, this.sep)

    return b64decodeInt(tuple[1])
  }
}

// private functions

/**
 * Signature splitter using seperator
 * @param {string} string String to be seperated
 * @param {string} seperator Seperator string
 * @return {Array} Array of seperated strings
 */
function rsplit (string, separator) {
  const index = string.lastIndexOf(separator)

  if (index === -1) {
    fail('BadSignature: Separator not found')
  }

  return [string.slice(0, index), string.slice(index + 1, string.length)]
}

/**
 * Function to sign the data using the key and salt
 * @param {Function} algorithm The HMAC algorithm
 * @param {string} secret The secret to be used
 * @param {string} salt The salt to be used
 * @param {string} value Value to be signed
 * @return {string} Base64 representation of string
 */
function signature (algorithm, secret, salt, value) {
  const key = algorithm(secret, salt)
  const sig = algorithm(key, value)

  return b64encode(sig)
}

/**
 * Contains the function to sign the data and creates the HMAC
 * @param {string} digestMethod The digest method to be used
 * @return {Function} Algorithm to sign data
 */
function hmacAlgorithm (digestMethod) {
  function signature (key, data) {
    const hmac = crypto.createHmac(digestMethod, key)

    hmac.update(data)

    return hmac.digest('binary')
  }

  return signature
}

/**
 * Base64 Encode a string and strip '='
 * @param {string} string Data to be encoded
 * @return {string} Base64 encoded result
 */
function b64encode (string) {
  const b64 = Buffer.from(string).toString('base64')
  return b64.replace(/\+/g, '-').replace(/=/g, '')
}

function b64encodeInt (num) {
  let hex = parseInt(num).toString(16)
  if (hex.length % 2 === 1) {
    hex = '0' + hex
  }
  const b64 = Buffer.from(hex, 'hex').toString('base64')
  return b64.replace(/\+/g, '-').replace(/=/g, '')
}

function b64decodeInt (string) {
  if ((string.length % 4) === 3) {
    string += '='
  } else if ((string.length % 4) === 2) {
    string += '=='
  } else if ((string.length % 4) === 1) {
    string += '==='
  }
  return parseInt(Buffer.from(string, 'base64').toString('hex'), 16)
}

function fail () {
  throw new Error(format.apply(null, arguments))
}

module.exports = {
  Signer: ReallyDangerous,
  TimestampSigner: TimestampSigner
}
