import { Router } from 'express';
import { db } from '../db.js';

export const electionsRouter = Router();

// GET /api/elections - List elections with optional filtering
electionsRouter.get('/', (req, res) => {
  try {
    const { state, type, status, year, search } = req.query;

    let query = 'SELECT * FROM elections WHERE 1=1';
    const params = [];

    if (state && state !== 'All') {
      query += ' AND state = ?';
      params.push(state);
    }
    if (type && type !== 'All') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (year) {
      query += ' AND year = ?';
      params.push(Number(year));
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY year DESC, name ASC';

    const elections = db.prepare(query).all(...params);
    res.json({ success: true, data: elections, count: elections.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/elections/:id - Get specific election with constituencies and candidate count
electionsRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const election = db.prepare('SELECT * FROM elections WHERE id = ?').get(id);

    if (!election) {
      return res.status(404).json({ success: false, error: 'Election not found' });
    }

    const constituencies = db.prepare('SELECT * FROM constituencies WHERE electionId = ?').all(id);
    const candidates = db.prepare(`
      SELECT c.*, p.shortName as partyShortName, p.name as partyName, p.symbol as partySymbol
      FROM candidates c
      LEFT JOIN parties p ON c.partyId = p.id
      WHERE c.electionId = ?
    `).all(id);

    res.json({
      success: true,
      data: {
        ...election,
        constituencies,
        candidates,
        candidatesCount: candidates.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
