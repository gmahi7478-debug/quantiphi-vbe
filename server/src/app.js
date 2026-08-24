import cors from 'cors';
import express from 'express';
import dashboardRoutes from './routes/dashboardRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

export default app;