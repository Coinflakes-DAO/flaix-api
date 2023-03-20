import { BigNumber, BigNumberish, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { ERC20ConstructorProps, ERC20Token } from './erc20Token';
import { getProvider } from './providers';

export const vaultABI = [
  'function admin() external view returns (address)',
  'function decimals() external view returns (uint8)',
  'function minimalOptionsMaturity() external view returns (uint256)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function totalSupply() external view returns (uint256)'
];

export type VaultConstructorProps = ERC20ConstructorProps & {
  admin: string;
  minimalOptionsMaturity: BigNumberish;
};

export class Vault {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  admin: string;
  minimalOptionsMaturity: number;

  constructor(props: VaultConstructorProps) {
    this.address = props.address;
    this.decimals = props.decimals;
    this.name = props.name;
    this.symbol = props.symbol;
    this.admin = props.admin;
    this.minimalOptionsMaturity = BigNumber.from(
      props.minimalOptionsMaturity
    ).toNumber();
  }

  static async import(address: string): Promise<Vault | null> {
    address = getAddress(address);
    const provider = getProvider();
    const contract = new Contract(address, vaultABI, provider);

    let vaultProps: any = {};
    try {
      const [admin, minimalOptionsMaturity] = await Promise.all([
        contract.admin(),
        contract.minimalOptionsMaturity()
      ]);
      vaultProps = { admin, minimalOptionsMaturity };
    } catch (err: any) {
      if (err?.code === 'CALL_EXCEPTION') return null;
      throw err;
    }
    const erc20 = await ERC20Token.import(address);
    vaultProps = { ...vaultProps, ...erc20 };
    return new Vault(vaultProps);
  }
}
