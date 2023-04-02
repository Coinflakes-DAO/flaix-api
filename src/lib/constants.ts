import { BigNumber } from 'ethers';

export const TIME_12_HOURS = 12 * 60 * 60 * 1000;
export const TIME_SECONDS = 1000;
export const TIME_MINUTES = 60 * TIME_SECONDS;
export const TIME_HOURS = 60 * TIME_MINUTES;
export const TIME_DAYS = 24 * TIME_HOURS;

export const BN_ZERO = BigNumber.from(0);
export const BN_ONE = BigNumber.from(1);

export const BN_10E = (exp: number): BigNumber => BigNumber.from(10).pow(exp);
