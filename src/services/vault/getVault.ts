import { Request, Response, NextFunction } from 'express';
import { useAsync } from '../../lib/asyncMiddleware';
import { Vault } from '../../model/vault';

export const getVault = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return await Vault.importVault(req.params.vaultAddress);
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
