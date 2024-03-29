# reallydangerous
NodeJS port of the Python itsdangerous module

## Features
- Timestamp signer with custom epoch support
- Reduce signature length by striping trailing "=" automatically
- Similar output to python itsdangerous
- Web-safe format (convert "+" to "-" and "/" to "_")
- Built-in web-safe Base64 encoder/decoder

## Installation
You can install this package via [NPM](https://npmjs.org/package/reallydangerous): `npm install reallydangerous`

## Usage
### Signer
```javascript
const RD = require('reallydangerous');
const signer = new RD.Signer('my-secret');

console.log(signer.sign('test'));
// 'test.c_1GcJ_PKrUqi7gx_0uP1rRAHMk'
console.log(signer.unsign('test.c_1GcJ_PKrUqi7gx_0uP1rRAHMk'));
// 'test'
```
#### new RD.Signer(secret[, salt, sep, key_derivation, digest_method, algorithm])
* `secret` {String} Secret to be used (Defaults to 'my-secret')
* `salt` {String} Salt to be used for key generation (Defaults to 'itsDangerous.Signer')
* `sep` {String} Separator to be used for token. Only characters not inside the base64 alphabet are supported.
* `key_derivation` {String} Similar to the python module. Available options are 'concat', 'hmac', 'none' and 'django-concat' (default)
* `digest_method` {String} Hashing function type to be used for hash calculation. Supported values include any hashing function from nodejs crypto library.
* `algorithm` {Class} Algorithm class instance used for signatures with the methods 'get_signature' and 'verify_signature'

#### signer.derive_key()
Returns a [Node.js Buffer](https://nodejs.org/dist/latest/docs/api/buffer.html) of the generated key.

#### signer.get_signature(value)
* `value` {String} Input to get signature of

Returns signature of value as string

#### signer.sign(value)
* `value` {String} The value to be signed

Returns signed string

#### signer.unsign(data)
* `data` {String} Signed value

Returns original value if signature is correct, else throw BadSignature error

### TimestampSigner
```javascript
const RD = require('reallydangerous');
const signer = new RD.TimestampSigner('my-secret');

console.log(signer.sign('test'));
// 'test.XTxTRw.dXVJz1MsFiapD0GQ5a16bHjOq2M'
console.log(signer.unsign('test.XTxTRw.dXVJz1MsFiapD0GQ5a16bHjOq2M'));
// 'test'
console.log(signer.unsign('test.XTxTRw.dXVJz1MsFiapD0GQ5a16bHjOq2M'), 0, true);
// ['test', 1564234567]
```

#### new RD.TimestampSigner(secret[, salt, sep, key_derivation, digest_method, algorithm])
* `secret` {String} Secret to be used (Defaults to 'my-secret')
* `salt` {String} Salt to be used for key generation (Defaults to 'itsdangerous.Signer')
* `sep` {String} Separator to be used for token. Only characters not inside the base64 alphabet are supported.
* `key_derivation` {String} Similar to the python module. Available options are 'concat', 'hmac', 'none' and 'django-concat' (default)
* `digest_method` {String} Hashing function type to be used for hash calculation. Supported values include any hashing function from nodejs crypto library.
* `algorithm` {Class} Algorithm class to sign and requires the methods 'get_signature' and 'verify_signature'

#### signer.set_epoch(epoch)
* `epoch` {Number|String} Epoch to use for signing/unsigning in seconds

#### signer.get_epoch()
Returns current epoch as a number

#### signer.sign(value)
* `value` {String} The value to be signed

Returns signed string with timestamp

#### signer.unsign(data[, max_age, return_timestamp])
* `data` {String} Signed value
* `max_age` {Number} Max age time in milliseconds. Default to 0 which is no expiry.
* `return_timestamp` {Boolean} Whether the timestamp should be returned. Defaults to 'false'

Returns original value if signature is correct and age is less than max_age (if defined), else throw BadTimeSignature error. Returns an array of the original value and the timestamp without epoch if 'return_timestamp' is set to true.

#### signer.get_timestamp()
Returns current timestamp in seconds

### Web-safe Base64 encode/decode
```javascript
const RD = require('reallydangerous');

console.log(RD.Base64.encode('test'));
// 'dGVzdA'
console.log(RD.Base64.decode('dGVzdA'));
// 'test'
```

#### Base64.encode(data)
* `data` {String|Buffer} Data to be encoded in web-safe format

Returns web-safe base64 encoded string

#### Base64.decode(payload, buffer)
* `payload` {String} Encoded base64 to be decoded
* `buffer` {Boolean} Set to `true` to return a buffer instead of a string

Returns the data buffer if the buffer parameter is true otherwise the original data string 