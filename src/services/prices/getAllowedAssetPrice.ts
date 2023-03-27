import { Request, Response } from 'express';
import { useAsync } from '../../lib/asyncMiddleware';
import { coingecko } from '../../lib/coingecko';
import { flaixApi } from '../../lib/flaixApi';

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
    const priceUsd = await coingecko.tokenPriceUsd(coingeckoToken.address);
    return { priceUsd };
  }
);
