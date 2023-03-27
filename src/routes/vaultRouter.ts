import { Router } from 'express';
import {
  getAllowedAsset,
  getAllowedAssets,
  getCallOption,
  getCallOptions,
  getVault
} from '../services/vaultServices';

export const vaultRouter = Router();

vaultRouter.get('/:vaultAddress', getVault);

vaultRouter.get('/:vaultAddress/call-options', getCallOptions);
vaultRouter.get('/:vaultAddress/call-option/:callOptionAddress', getCallOption);

vaultRouter.get('/:vaultAddress/allowed-assets', getAllowedAssets);
vaultRouter.get('/:vaultAddress/allowed-asset/:assetAddress', getAllowedAsset);
