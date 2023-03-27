import '../lib/env';
import express, { Express } from 'express';
import { errorLogger, requestId, requestLogger } from '../lib/logger';
import { vaultRouter } from '../routes/vaultRouter';

const app: Express = express();
const port = 4000;

app.use(requestId);
app.use(requestLogger);

app.use('/vault', vaultRouter);

app.use(errorLogger);

app.listen(port, () => {
  console.log(`FLAIX API listening at http://localhost:${port}`);
});
