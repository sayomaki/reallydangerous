# reallydangerous
NodeJS port of the Python itsdangerous module

## Features
- Timestamp signer
- Uses number instead of string for timestamp to reduce length
- Strips trailing "=" automatically
- Web-safe format (convert "+" to "-")

## Usage
### Signer
```javascript
const RD = require('reallydangerous');
const signer = new RD.Signer('my-secret');

console.log(signer.sign('test'));
console.log(signer.unsign(''));
```

### TimestampSigner
```javascript
const RD = require('reallydangerous');
const signer = new RD.TimestampSigner('my-secret');

console.log(signer.sign('test'));
console.log(signer.unsign(''));
console.log(signer.timestamp(''));
```
