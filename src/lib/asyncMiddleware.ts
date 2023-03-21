import { Request, Response, NextFunction } from 'express';

function handleResponse(res: Response, data: any) {
  if (!res.headersSent) res.status(200).json({ data });
}

export type middlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type asyncMiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function useAsync(p: asyncMiddlewareFn): middlewareFn {
  return (req: Request, res: Response, next: NextFunction) => {
    p(req, res, next)
      .then((data: any) => handleResponse(res, data))
      .catch(next);
  };
}
