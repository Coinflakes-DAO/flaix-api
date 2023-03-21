import '../lib/env';
import express, { Express, Request, Response, NextFunction } from 'express';
import {
  getCallOption,
  getCallOptions,
  getVault
} from '../services/vaultService';
const app: Express = express();
const port = 4000;

app.get('/vault/:vaultAddress', getVault);

app.get('/vault/:vaultAddress/call-options', getCallOptions);

app.get('/vault/:vaultAddress/call-option/:callOptionAddress', getCallOption);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return;
  res.status(500).json({ error: 'internal error' });
  next();
});

app.listen(port, () => {
  console.log(`FLAIX API listening at http://localhost:${port}`);
});
