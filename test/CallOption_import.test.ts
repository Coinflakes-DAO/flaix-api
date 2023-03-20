import { expect } from 'chai';
import { CallOption } from '../src/lib/callOption';
import { db } from '../src/lib/db';

describe('CallOption.import(address): ', () => {
  before(async () => {
    await db.callOption.deleteMany();
  });

  it('imports a CallOption from the blockchain', async () => {
    const address = '0xe752D92ABA07902BCbae3E6C89724e40DF99b598';
    const callOption = await CallOption.import(address);
    expect(callOption.address).to.eq(address);
    expect(callOption.name).to.eq('FLAIX Call Option 26-03-2023');
    expect(callOption.symbol).to.eq('callFLAIX260323');
    expect(callOption.underlying).to.eq(
      '0x967da4048cD07aB37855c090aAF366e4ce1b9F48'
    );
  });
});
