import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { getProvider } from '../lib/providers';

export const erc20ABI = [
  'function approve(address, uint256) public returns (bool)',
  'function balanceOf(address) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function totalSupply() public view returns (uint256)'
];

export type ERC20ConstructorProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export class ERC20Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;

  constructor(props: ERC20ConstructorProps) {
    this.address = props.address;
    this.decimals = props.decimals;
    this.name = props.name;
    this.symbol = props.symbol;
  }
}

export async function importErc20Token(address: string): Promise<ERC20Token> {
  address = getAddress(address);
  const provider = getProvider();
  const contract = new ethers.Contract(address, erc20ABI, provider);
  const [decimals, name, symbol] = await Promise.all([
    contract.decimals(),
    contract.name(),
    contract.symbol()
  ]);
  return new ERC20Token({
    address,
    decimals,
    name,
    symbol
  });
}
