const rd = require('..');
const payload = 'a_testing_payload';

console.log('Testing message signing and unsigning without using a secret...');
(() => {
  const Signer = new rd.Signer();
  const signed = Signer.sign(payload);
  if (Signer.unsign(signed) !== payload) {
    throw Error ('Test failed. (Single sign)');
  }

  const TimestampSigner = new rd.TimestampSigner();
  const timesigned = TimestampSigner.sign(payload);
  const time = TimestampSigner.get_timestamp();
  if (TimestampSigner.unsign(timesigned) !== payload) {
    throw Error ('Test failed. (Time unsign)');
  }

  const results = TimestampSigner.unsign(timesigned, 0, true);
  if (results[1] !== time) {
    throw Error ('Test failed. (Time checking)');
  }
})();

console.log('All tests passed!');
process.exit(0);