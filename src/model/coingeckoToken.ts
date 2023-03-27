import axios from 'axios';
import { coingecko, CoingeckoClient } from '../lib/coingecko';
import {
  ERC20ConstructorProps,
  ERC20Token,
  importErc20Token
} from './erc20Token';

export type CoingeckoTokenConstructorProps = {
  coingeckoId: string;
} & ERC20ConstructorProps;

export class CoingeckoToken extends ERC20Token {
  coingeckoId: string;

  constructor(props: CoingeckoTokenConstructorProps) {
    super(props);
    this.coingeckoId = props.coingeckoId;
  }

  getPriceUsd(): Promise<number> {
    return coingecko.tokenPriceUsd(this.address);
  }
}

export async function getTokenPriceUsd(address: string): Promise<number> {
  return await coingecko.tokenPriceUsd(address);
}

export async function importCoingeckoToken(
  address: string
): Promise<CoingeckoToken | null> {
  const erc20Props = await importErc20Token(address);
  if (!erc20Props) return null;
  const { id: coingeckoId } = await coingecko.tokenId(address);
  if (!coingeckoId) return null;
  return new CoingeckoToken({ ...erc20Props, coingeckoId });
}
