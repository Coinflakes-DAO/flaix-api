import { Router } from 'express';
import { getAllowedAssetPrice } from '../services/prices/getAllowedAssetPrice';

export const pricesRouter = Router();

pricesRouter.get(
  '/vault/:vaultAddress/allowed-asset/:assetAddress',
  getAllowedAssetPrice
);
