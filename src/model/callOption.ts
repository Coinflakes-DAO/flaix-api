import { BigNumber, BigNumberish, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { erc20ABI, ERC20Token, importErc20Token } from './erc20Token';
import { getProvider } from '../lib/providers';

export const callOptionABI = [
  'function asset() external view returns (address)',
  'function decimals() external view returns (uint8)',
  'function maturityTimestamp() external view returns (uint256)',
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function totalSupply() external view returns (uint256)',
  'function vault() external view returns (address)'
];

export type CallOptionConstructorProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: BigNumberish;
  maturityTimestamp: BigNumberish;
  underlying: string;
  vault: string;
};

export class CallOption {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  maturityTimestamp: BigNumber;
  underlying: string;
  vault: string;

  constructor(props: CallOptionConstructorProps) {
    this.address = getAddress(props.address);
    this.name = props.name;
    this.symbol = props.symbol;
    this.decimals = BigNumber.from(props.decimals).toNumber();
    this.underlying = props.underlying;
    this.maturityTimestamp = BigNumber.from(props.maturityTimestamp);
    this.vault = props.vault;
  }

  static async import(address: string): Promise<CallOption> {
    address = getAddress(address);
    const provider = getProvider();
    let contract = new Contract(address, callOptionABI, provider);

    const [maturityTimestamp, underlying, vault] = await Promise.all([
      contract.maturityTimestamp(),
      contract.asset(),
      contract.vault()
    ]);

    const erc20Props: ERC20Token = await importErc20Token(address);
    const callOption = new CallOption({
      ...erc20Props,
      maturityTimestamp,
      underlying,
      vault
    });

    return callOption;
  }
}
