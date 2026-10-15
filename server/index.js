import express from 'express';
import cors from 'cors';
import { db, initDatabase } from './db.js';
import { electionsRouter } from './routes/elections.js';
import { partiesRouter } from './routes/parties.js';
import { constituenciesRouter } from './routes/constituencies.js';
import { candidatesRouter } from './routes/candidates.js';
import { policiesRouter } from './routes/policies.js';
import { resourcesRouter } from './routes/resources.js';
import { enquiriesRouter } from './routes/enquiries.js';

// Initialize and seed database if not already seeded
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Indian Election Information Portal Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: 'SQLite (node:sqlite native)'
  });
});

// Overview Stats API
app.get('/api/stats', (req, res) => {
  try {
    const electionsCount = db.prepare('SELECT count(*) as count FROM elections').get().count;
    const partiesCount = db.prepare('SELECT count(*) as count FROM parties').get().count;
    const constituenciesCount = db.prepare('SELECT count(*) as count FROM constituencies').get().count;
    const candidatesCount = db.prepare('SELECT count(*) as count FROM candidates').get().count;
    const policiesCount = db.prepare('SELECT count(*) as count FROM policies').get().count;
    const enquiriesCount = db.prepare('SELECT count(*) as count FROM enquiries').get().count;

    res.json({
      success: true,
      data: {
        electionsCount,
        partiesCount,
        constituenciesCount,
        candidatesCount,
        policiesCount,
        enquiriesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mount Routes
app.use('/api/elections', electionsRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/constituencies', constituenciesRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/enquiries', enquiriesRouter);

// 404 Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Election Portal Backend running on http://localhost:${PORT}`);
});
