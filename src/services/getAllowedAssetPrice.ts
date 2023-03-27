import { Request, Response, NextFunction } from 'express';
import { useAsync } from '../lib/asyncMiddleware';

export const getAllowedAssetPrice = useAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {}
);
