import { BigNumber, BigNumberish, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { erc20ABI, ERC20Token } from './erc20Token';
import { getProvider } from './providers';
import { db } from './db';

export const callOptionABI = [
  'function asset() external view returns (address)',
  'function maturityTimestamp() external view returns (uint256)',
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function totalSupply() external view returns (uint256)'
];

export type CallOptionDbProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  maturityTimestamp: number;
  underlying: string;
};

export type CallOptionConstructorProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: BigNumberish;
  maturityTimestamp: BigNumberish;
  underlying: string;
};

export class CallOption {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  maturityTimestamp: BigNumber;
  underlying: string;

  constructor(props: CallOptionConstructorProps) {
    this.address = getAddress(props.address);
    this.name = props.name;
    this.symbol = props.symbol;
    this.decimals = BigNumber.from(props.decimals).toNumber();
    this.underlying = props.underlying;
    this.maturityTimestamp = BigNumber.from(props.maturityTimestamp);
  }

  async save(): Promise<CallOption> {
    const convertThis = (_this: CallOption): CallOptionDbProps => ({
      ..._this,
      maturityTimestamp: _this.maturityTimestamp.toNumber()
    });
    await db.callOption.upsert({
      where: { address: this.address },
      create: convertThis(this),
      update: convertThis(this)
    });
    return this;
  }

  static async load(address: string): Promise<CallOption | null> {
    address = getAddress(address);
    const props: CallOptionDbProps | null = await db.callOption.findUnique({
      where: { address }
    });
    if (!props) return null;
    return new CallOption({
      ...props
    });
  }

  static async import(address: string): Promise<CallOption> {
    address = getAddress(address);
    const erc20Props: ERC20Token = await ERC20Token.import(address);
    const provider = getProvider();
    let contract = new Contract(address, callOptionABI, provider);
    const [maturityTimestamp, underlying] = await Promise.all([
      contract.maturityTimestamp(),
      contract.asset()
    ]);
    contract = new Contract(underlying, erc20ABI, provider);
    const totalUnderlyingSupply = await contract.balanceOf(address);

    const callOption = new CallOption({
      ...erc20Props,
      maturityTimestamp,
      underlying
    });
    await callOption.save();

    await ERC20Token.import(underlying);

    return callOption;
  }
}
