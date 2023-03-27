import { BigNumber, BigNumberish, Contract } from 'ethers';
import {
  getAddress,
  Interface,
  keccak256,
  toUtf8Bytes
} from 'ethers/lib/utils';
import {
  ERC20ConstructorProps,
  ERC20Token,
  importErc20Token
} from './erc20Token';
import { etherscan, EtherscanLogEvent } from '../lib/etherscan';
import { getProvider } from '../lib/providers';

export const vaultABI = [
  'event IssueCallOptions(address indexed,address indexed,string,string,uint256,address indexed,uint256,uint256)',
  'function admin() external view returns (address)',
  'function decimals() external view returns (uint8)',
  'function minimalOptionsMaturity() external view returns (uint256)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'function allowedAssets() external view returns (uint256)',
  'function allowedAsset(uint256) external view returns (address)',
  'function isAssetAllowed(address) public view returns (bool)'
];

export const vaultInterface = new Interface(vaultABI);

const topic0 = {
  IssueCallOptions: keccak256(
    toUtf8Bytes(
      'IssueCallOptions(address,address,string,string,uint256,address,uint256,uint256)'
    )
  )
};

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

  static async importVault(address: string): Promise<Vault | null> {
    address = getAddress(address);
    const provider = getProvider();
    const contract = new Contract(address, vaultABI, provider);

    let vaultProps: any = {};
    const [admin, minimalOptionsMaturity] = await Promise.all([
      contract.admin(),
      contract.minimalOptionsMaturity()
    ]);
    vaultProps = { admin, minimalOptionsMaturity };
    const erc20 = await importErc20Token(address);
    vaultProps = { ...vaultProps, ...erc20 };
    return new Vault(vaultProps);
  }

  static async importCallOptions(address: string): Promise<string[]> {
    address = getAddress(address);
    const events = (await etherscan().getLogEvents(
      address,
      16843141,
      topic0.IssueCallOptions
    )) as EtherscanLogEvent[];

    return events.map((event: any): any => {
      const parsedLog = vaultInterface.parseLog(
        event as { topics: string[]; data: string }
      );
      return {
        address: parsedLog.args[0] as string,
        name: parsedLog.args[2] as string,
        symbol: parsedLog.args[3] as string,
        maturity: (parsedLog.args[7] as BigNumber).toNumber()
      };
    });
  }

  static async importAllowedAssets(address: string): Promise<string[]> {
    address = getAddress(address);
    const provider = getProvider();
    const contract = new Contract(address, vaultABI, provider);
    const allowedAssets = await contract.allowedAssets();
    const allowedAssetAddresses = [];
    for (let i = 0; i < allowedAssets; i++) {
      allowedAssetAddresses.push(await contract.allowedAsset(i));
    }
    return allowedAssetAddresses;
  }
}
