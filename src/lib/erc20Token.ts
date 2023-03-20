import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { db } from './db';
import { getProvider } from './providers';

export const erc20ABI = [
  'function approve(address, uint256) public returns (bool)',
  'function balanceOf(address) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function totalSupply() public view returns (uint256)'
];

type ERC20ConstructorProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

type ERC20DbProps = {
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

  static async import(address: string): Promise<ERC20Token> {
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

  static async load(address: string): Promise<ERC20Token | null> {
    address = getAddress(address);
    const props: ERC20DbProps | null = await db.erc20Token.findUnique({
      where: { address }
    });
    if (!props) return null;
    return new ERC20Token({ ...props });
  }

  async save(): Promise<ERC20Token> {
    await db.erc20Token.upsert({
      where: { address: this.address },
      create: { ...this },
      update: { ...this }
    });
    return this;
  }
}
