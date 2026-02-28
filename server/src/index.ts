import express from 'express';
import { healthRouter } from './routes/health';
import { itemsRouter } from './routes/items';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', itemsRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
