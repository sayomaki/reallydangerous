const RD = require('../src');
const secret = 'testkey';
const payload = 'this_is_a_test';

describe('message signing and unsigning with RD.Signer', () => {
  test('sign and unsign message', () => {
    const signer = new RD.Signer(secret);
    const signed = signer.sign(payload);
    expect(signer.unsign(signed)).toBe(payload);
  });
  
  test('sign and unsign double signed message', () => {
    const signer = new RD.Signer(secret);
    const twice = signer.sign(signer.sign(payload));
    expect(signer.unsign(signer.unsign(twice))).toBe(payload);
  });

  test('sign and unsign message without secret', () => {
    const signer = new RD.Signer();
    const signed = signer.sign(payload);
    expect(signer.unsign(signed)).toBe(payload);
  });
});

describe('message signing and unsigning with RD.TimestampSigner', () => {
  test('sign and unsign message', () => {
    const timestampSigner = new RD.TimestampSigner(secret);
    const signed = timestampSigner.sign(payload);
    expect(timestampSigner.unsign(signed)).toBe(payload);
  });

  test('unsign with output timestamp', () => {
    const timestampSigner = new RD.TimestampSigner(secret);
    const signed = timestampSigner.sign(payload);
    const time = timestampSigner.get_timestamp();
    expect(timestampSigner.unsign(signed, 0, true)[1]).toBe(time);
  });

  test('delayed unsigning with maxAge', async () => {
    const timestampSigner = new RD.TimestampSigner(secret);
    const signed = timestampSigner.sign(payload);
    await new Promise((r) => setTimeout(r, 3000));
    expect(() => timestampSigner.unsign(signed, 2)).toThrow('BadTimeSignature: Signature age 3 > 2 seconds');
  });

  test('sign and unsign message without secret', async () => {
    const timestampSigner = new RD.TimestampSigner();
    const signed = timestampSigner.sign(payload);
    const time = timestampSigner.get_timestamp();

    expect(timestampSigner.unsign(signed)).toBe(payload);
    expect(timestampSigner.unsign(signed, 0, true)[1]).toBe(time);
  });
});
