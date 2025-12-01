import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes/index.js';
import { openApiSpec } from './docs/spec.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api', router);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

export default app;

