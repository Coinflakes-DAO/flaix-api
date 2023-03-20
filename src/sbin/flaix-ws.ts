import express, { Express, Request, Response } from 'express';
import { db } from '../lib/db';
import { Vault } from '../lib/vault';
const app: Express = express();
const port = 4000;

app.get('/vault/:address', async (req: Request, res: Response) => {
  const vault = await Vault.import(req.params.address);
  if (!vault) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  return res.json(vault);
});

app.get('/call-options', async (req: Request, res: Response) => {
  const callOptions = await db.callOption.findMany({
    orderBy: { maturityTimestamp: 'desc' }
  });
  res.json(callOptions);
});

app.get('/call-option/:address', async (req: Request, res: Response) => {
  const callOption = await db.callOption.findUnique({
    where: { address: req.params.address }
  });
  if (!callOption) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(callOption);
});

app.get('/erc20-token/:address', async (req: Request, res: Response) => {
  let erc20Token = await db.erc20Token.findUnique({
    where: { address: req.params.address }
  });
  if (!erc20Token) {
    erc20Token = await db.callOption.findUnique({
      select: {
        address: true,
        name: true,
        symbol: true,
        decimals: true
      },
      where: { address: req.params.address }
    });
  }
  if (!erc20Token) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(erc20Token);
});

app.listen(port, () => {
  console.log(`FLAIX API listening at http://localhost:${port}`);
});
