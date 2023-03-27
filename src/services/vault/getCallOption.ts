import { Request, Response, NextFunction } from 'express';
import { useAsync } from '../../lib/asyncMiddleware';
import { CallOption } from '../../model/callOption';
import { importErc20Token } from '../../model/erc20Token';

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
      const underlying = await importErc20Token(underlyingAddress);
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
