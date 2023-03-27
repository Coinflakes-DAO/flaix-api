import axios, { AxiosInstance } from 'axios';
import URI from 'urijs';

export type CoingeckoClientConstructorProps = {
  apiKey?: string;
  baseUri: string;
};

export class CoingeckoClient {
  public baseUri: URI;
  public axios: AxiosInstance;

  constructor(props: CoingeckoClientConstructorProps) {
    this.baseUri = URI(props.baseUri);
    this.axios = axios.create({
      baseURL: this.baseUri.toString(),
      timeout: 10000,
      params: props.apiKey ? { x_cg_pro_api_key: props.apiKey } : {}
    });
  }

  static newInstance(props: CoingeckoClientConstructorProps): CoingeckoClient {
    if (!process.env.COINGECKO_URL || process.env.COINGECKO_URL === '')
      throw new Error('COINGECKO_URL not set.');
    return new CoingeckoClient(props);
  }

  async call<T>(endpoint: string): Promise<T> {
    const response = await this.axios.get(endpoint);
    return response.data as T;
  }

  async tokenId(
    contractAddress: string,
    chain = 'ethereum' as string
  ): Promise<{ id: string }> {
    return (await this.call(`/coins/${chain}/contract/${contractAddress}`)) as {
      id: string;
    };
  }
}

export const coingecko = CoingeckoClient.newInstance({
  baseUri: process.env.COINGECKO_URL ?? '',
  apiKey: process.env.COINGECKO_API_KEY
});
