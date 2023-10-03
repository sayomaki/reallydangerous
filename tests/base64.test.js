const RD = require('../src');
const Base64 = RD.Base64;

const test_payload_string = 'my_testing_payload';
const test_payload_buffer = Buffer.from('my_buffer_payload');

test('base64 encoding and decoding with string', () => {
  const encoded = Base64.encode(test_payload_string);
  const decoded = Base64.decode(encoded);

  expect(decoded).toBe(test_payload_string);
});

test('base64 encoding and decoding with buffer', () => {
  const encoded = Base64.encode(test_payload_buffer);
  const decoded = Base64.decode(encoded, true);

  expect(Buffer.compare(decoded, test_payload_buffer)).toBe(0);
});
