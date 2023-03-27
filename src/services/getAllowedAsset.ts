import { Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { Request, Response, NextFunction } from 'express';
import { useAsync } from '../lib/asyncMiddleware';
import { getProvider } from '../lib/providers';
import { importCoingeckoToken } from '../model/coingeckoToken';
import { vaultABI } from '../model/vault';

export const getAllowedAsset = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const vaultAddress = getAddress(req.params.vaultAddress);
      const assetAddress = getAddress(req.params.assetAddress);
      const provider = getProvider();
      const vaultContract = new Contract(vaultAddress, vaultABI, provider);
      const isAllowed = await vaultContract.isAssetAllowed(assetAddress);
      if (!isAllowed) {
        return res.status(400).json({ error: 'asset is not allowed' });
      }
      const asset = await importCoingeckoToken(assetAddress);
      if (!asset) {
        return res.status(400).json({ error: 'asset not found on coingecko' });
      }
      return asset;
    } catch (err: any) {
      if (err?.code === 'CALL_EXCEPTION') {
        res.status(400).json({ error: 'address is no vault' });
      } else if (err?.reason === 'invalid address') {
        res.status(400).json({ error: 'invalid address' });
      } else {
        throw err;
      }
    }
  }
);
