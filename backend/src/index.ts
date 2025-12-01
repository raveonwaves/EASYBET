import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`);
});

