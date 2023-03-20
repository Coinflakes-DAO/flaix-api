import { expect } from 'chai';
import { CallOption } from '../src/lib/callOption';
import { db } from '../src/lib/db';

describe('CallOption.save(address): ', () => {
  before(async () => {
    await db.callOption.deleteMany();
  });

  it('saves a CallOption to the database', async () => {
    const address = '0xe752D92ABA07902BCbae3E6C89724e40DF99b598';
    const callOption = new CallOption({
      address,
      name: 'FLAIX Call Option 26-03-2023',
      symbol: 'callFLAIX260323',
      decimals: 18,
      maturityTimestamp: 1679785200,
      underlying: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48'
    });
    await callOption.save();
    const result: any = await db.$queryRaw`SELECT * FROM CallOption`;
    expect(result.length).to.eq(1);
    expect(result[0].address).to.eq(address);
  });
});
