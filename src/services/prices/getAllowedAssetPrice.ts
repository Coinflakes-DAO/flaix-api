import { Request, Response } from 'express';
import { useAsync } from '../../lib/asyncMiddleware';
import { coingecko } from '../../lib/coingecko';
import { flaixApi } from '../../lib/flaixApi';
import { parseUnits } from 'ethers/lib/utils';
import { erc20ABI } from '../../model/erc20Token';
import { BigNumber, Contract } from 'ethers';
import { getProvider } from '../../lib/providers';
import { BN_10E } from '../../lib/constants';

export const getAllowedAssetPrice = useAsync(
  async (req: Request, res: Response): Promise<any> => {
    const { vaultAddress, assetAddress } = req.params;

    const coingeckoToken = await flaixApi.loadAllowedAsset(
      vaultAddress,
      assetAddress
    );
    if (!coingeckoToken) {
      res.status(400).json({ error: 'invalid vault asset' });
      return;
    }
    const floatPriceUsd = await coingecko.tokenPriceUsd(coingeckoToken.address);
    const tokenContract = new Contract(assetAddress, erc20ABI, getProvider());
    const balance = (await tokenContract.balanceOf(vaultAddress)) as BigNumber;

    const bnPriceUsd = parseUnits(floatPriceUsd + '', coingeckoToken.decimals);
    const bnWorthUsd = bnPriceUsd
      .mul(balance)
      .div(BN_10E(coingeckoToken.decimals));
    return {
      balance: balance.toString(),
      priceUsd: bnPriceUsd.toString(),
      worthUsd: bnWorthUsd.toString(),
      decimals: coingeckoToken.decimals
    };
  }
);
