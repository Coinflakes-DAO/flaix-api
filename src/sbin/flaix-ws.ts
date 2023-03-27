import '../lib/env';
import express, { Express, Request, Response, NextFunction } from 'express';
import { getVault } from '../services/getVault';
import { getCallOptions } from '../services/getCallOptions';
import { getCallOption } from '../services/getCallOption';
import { getAllowedAssets } from '../services/getAllowedAssets';
import { getAllowedAsset } from '../services/getAllowedAsset';
import { logger } from '../lib/logger';
import expressWinston from 'express-winston';

const app: Express = express();
const port = 4000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.append(
    'X-Request-Id',
    Math.random().toString(16).substring(2, 16).toUpperCase()
  );
  next();
});

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    dynamicMeta: (req: Request, res: Response) => ({
      requestId: res.getHeader('X-Request-Id')
    })
  })
);

app.get('/vault/:vaultAddress', getVault);

app.get('/vault/:vaultAddress/call-options', getCallOptions);
app.get('/vault/:vaultAddress/call-option/:callOptionAddress', getCallOption);

app.get('/vault/:vaultAddress/allowed-assets', getAllowedAssets);
app.get('/vault/:vaultAddress/allowed-asset/:assetAddress', getAllowedAsset);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return;
  logger.error('INTERNAL ERROR', {
    requestId: res.getHeader('X-Request-Id'),
    err: err?.toString()
  });
  res.status(500).json({ error: 'internal error' });
  next();
});

app.listen(port, () => {
  console.log(`FLAIX API listening at http://localhost:${port}`);
});
