const rd = require('..');
const base64 = rd.Base64;

const test_payload_string = 'my_testing_payload';
const test_payload_buffer = Buffer.from('my_buffer_payload');

console.log('Testing string encoding and decoding with Base64 web...');
(() => {
  const encoded = base64.encode(test_payload_string);
  const decoded = base64.decode(encoded);
  
  if (decoded !== test_payload_string) {
    throw Error('Test failed (Base64 string encoding)')
  }
})();


console.log('Testing buffer encoding and decoding with Base64 web...');
(() => {
  const encoded = base64.encode(test_payload_buffer);
  const decoded = base64.decode(encoded, true);
  
  if (Buffer.compare(decoded, test_payload_buffer) !== 0) {
    throw Error('Test failed (Base64 buffer encoding)')
  }
})();

console.log('All tests passed!');
process.exit(0);