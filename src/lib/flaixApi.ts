import axios, { AxiosInstance } from 'axios';
import URI from 'urijs';
import {
  CoingeckoToken,
  CoingeckoTokenConstructorProps
} from '../model/coingeckoToken';
import { Vault, VaultConstructorProps } from '../model/vault';

export type FlaixApiClientConstructorProps = {
  baseUri: string;
};

export class FlaixApiClient {
  baseUri: URI;
  axios: AxiosInstance;

  constructor(props: FlaixApiClientConstructorProps) {
    if (!props.baseUri || props.baseUri === '')
      throw new Error('FLAIX_API_URL not set.');
    this.baseUri = URI(props.baseUri);
    this.axios = axios.create({
      baseURL: this.baseUri.toString()
    });
  }

  async loadVault(address: string): Promise<Vault> {
    const props = (await this.call(
      `/vault/${address}`
    )) as VaultConstructorProps;
    return new Vault(props);
  }

  async loadAllowedAsset(
    vaultAddress: string,
    assetAddress: string
  ): Promise<CoingeckoToken> {
    const props = (await this.call(
      `/vault/${vaultAddress}/allowed-asset/${assetAddress}`
    )) as CoingeckoTokenConstructorProps;
    return new CoingeckoToken(props);
  }

  async call<T>(endpoint: string): Promise<T> {
    type Response = { data: { data: T; error?: any } };
    const response = (await this.axios.get(endpoint)) as Response;
    if (response.data.error) throw response.data.error;
    return response.data.data as T;
  }
}

export const flaixApi = new FlaixApiClient({
  baseUri: process.env.FLAIX_API_URL || ''
});
