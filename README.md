# reallydangerous
NodeJS port of the Python itsdangerous module

## Features
- Timestamp signer
- Uses number instead of string for timestamp to reduce length
- Strips trailing "=" automatically
- Web-safe format (convert "+" to "-" and "/" to "_")

## Usage
### Signer
```javascript
const RD = require('reallydangerous');
const signer = new RD.Signer('my-secret');

console.log(signer.sign('test'));
// 'test.dTvDkVZCw4Ygw7hvGlPDjMKjA8Kic8OrQcK6w7A'
console.log(signer.unsign('test.dTvDkVZCw4Ygw7hvGlPDjMKjA8Kic8OrQcK6w7A'));
// 'test'
```
#### new RD.Signer(secret[, opts])
* `secret` {String} Secret to be used
* `opts` {Object}
  * `EPOCH` {Number} Epoch to be used for timestamps (default is 1293840000)
  * `sep` {String} Seperator for signature
  * `salt` {String} Salt to be used (defaults to 'itsDangerous')
  * `digestMethod` {String} Digest method for signing (default: sha1)

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
// 'test.AWPe1LX3.wrh5wojCncKyN8OEWEU3asOpYsOvMSDDrhoXwrM'
console.log(signer.unsign('test.AWPe1LX3.wrh5wojCncKyN8OEWEU3asOpYsOvMSDDrhoXwrM'));
// 'test'
console.log(signer.timestamp('test.AWPe1LX3.wrh5wojCncKyN8OEWEU3asOpYsOvMSDDrhoXwrM'));
// 1529745712247
```

#### new RD.TimestampSigner(secret[, opts])
* `secret` {String} Secret to be used
* `opts` {Object}
  * `EPOCH` {Number} Epoch to be used for timestamps (default is 1293840000)
  * `sep` {String} Seperator for signature
  * `salt` {String} Salt to be used (defaults to 'itsDangerous')
  * `digestMethod` {String} Digest method for signing (default: sha1)
  
#### signer.sign(value)
* `value` {String} The value to be signed

Returns signed string with timestamp

#### signer.unsign(data[, maxAge])
* `data` {String} Signed value
* `maxAge` {Number} Max age time in milliseconds

Returns original value if signature is correct and age is less than maxAge(if defined), else throw BadSignature error

#### signer.timestamp(data)
* `data` {String} Signed value

Returns created timestamp (in milliseconds) if signature is correct, else throw BadSignature error

