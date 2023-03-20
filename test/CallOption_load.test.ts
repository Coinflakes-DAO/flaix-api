import { expect } from 'chai';
import { CallOption } from '../src/lib/callOption';
import { db } from '../src/lib/db';

describe('CallOption.load(address): ', () => {
  before(async () => {
    await db.callOption.deleteMany();
  });

  before(async () => {
    await db.$executeRaw`INSERT INTO CallOption (address, name, symbol, decimals, maturityTimestamp, underlying) VALUES ('0xe752D92ABA07902BCbae3E6C89724e40DF99b598', 'FLAIX Call Option 26-03-2023', 'callFLAIX260323', 18, 1679788800, '0x967da4048cD07aB37855c090aAF366e4ce1b9F48')`;
  });

  it('load a CallOption from the database', async () => {
    const address = '0xe752D92ABA07902BCbae3E6C89724e40DF99b598';
    const callOption = await CallOption.load(address);
    expect(callOption).to.be.an('object');
    if (!callOption) return;
    expect(callOption.address).to.eq(address);
    expect(callOption.name).to.eq('FLAIX Call Option 26-03-2023');
    expect(callOption.symbol).to.eq('callFLAIX260323');
    expect(callOption.maturityTimestamp.toNumber()).to.eq(1679788800);
    expect(callOption.underlying).to.eq(
      '0x967da4048cD07aB37855c090aAF366e4ce1b9F48'
    );
  });
});
