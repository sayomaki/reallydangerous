const rd = require('..');
const secret = 'testkey';
const payload = 'this_is_a_test';

console.log('Testing message signing and unsigning with Signer...');
(() => {
  const Signer = new rd.Signer(secret);
  const signed = Signer.sign(payload);
  if (Signer.unsign(signed) !== payload) {
    throw Error ('Test failed. (Single sign)');
  }

  const twice = Signer.sign(Signer.sign(payload));
  if (Signer.unsign(Signer.unsign(twice)) !== payload) {
    throw Error ('Test failed. (Double signing)');
  }
})();

console.log('Testing message signing and unsigning with TimestampSigner...');
(() => {
  const TimestampSigner = new rd.TimestampSigner(secret);
  const signed = TimestampSigner.sign(payload);
  const time = TimestampSigner.get_timestamp();
  if (TimestampSigner.unsign(signed) !== payload) {
    throw Error ('Test failed. (Time unsign)');
  }

  const results = TimestampSigner.unsign(signed, 0, true);
  if (results[1] !== time) {
    throw Error ('Test failed. (Time checking)');
  }

  setTimeout(() => {
    try {
      const aged = TimestampSigner.unsign(signed, 2);
      throw Error ('Test failed. (Expired test)');
    }
    catch (e) {
      // pass
      done();
    }
  }, 3000);
})();

const done = () => {
  console.log('All tests passed!');
  process.exit(0);
}