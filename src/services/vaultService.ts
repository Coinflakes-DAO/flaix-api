import { Request, Response, NextFunction } from 'express';
import { useAsync } from '../lib/asyncMiddleware';
import { CallOption } from '../model/callOption';
import { ERC20Token } from '../model/erc20Token';
import { Vault } from '../model/vault';

export const getVault = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return await Vault.import(req.params.vaultAddress);
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

export const getCallOptions = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return await Vault.importCallOptions(req.params.vaultAddress);
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

export const getCallOption = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const callOption = await CallOption.import(req.params.callOptionAddress);
      if (callOption.vault !== req.params.vaultAddress) {
        return res
          .status(400)
          .json({ error: 'option address does not match vault' });
      }
      const underlyingAddress = callOption.underlying;
      const underlying = await ERC20Token.import(underlyingAddress);
      return { ...callOption, underlying };
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
