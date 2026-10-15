import { Router } from 'express';
import { db } from '../db.js';

export const constituenciesRouter = Router();

// GET /api/constituencies - List constituencies with optional filters
constituenciesRouter.get('/', (req, res) => {
  try {
    const { electionId, state, search } = req.query;

    let query = `
      SELECT co.*, e.name as electionName, e.status as electionStatus
      FROM constituencies co
      LEFT JOIN elections e ON co.electionId = e.id
      WHERE 1=1
    `;
    const params = [];

    if (electionId && electionId !== 'All') {
      query += ' AND co.electionId = ?';
      params.push(electionId);
    }
    if (state && state !== 'All') {
      query += ' AND co.state = ?';
      params.push(state);
    }
    if (search) {
      query += ' AND (co.name LIKE ? OR co.district LIKE ? OR co.state LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY co.state ASC, co.name ASC';

    const constituencies = db.prepare(query).all(...params);

    // Attach candidate counts
    const candCounts = db.prepare(`
      SELECT constituencyId, count(*) as count FROM candidates GROUP BY constituencyId
    `).all();
    const countMap = Object.fromEntries(candCounts.map(r => [r.constituencyId, r.count]));

    const enriched = constituencies.map(c => ({
      ...c,
      candidateCount: countMap[c.id] || 0
    }));

    res.json({ success: true, data: enriched, count: enriched.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/constituencies/:id - Get specific constituency with candidates
constituenciesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const constituency = db.prepare(`
      SELECT co.*, e.name as electionName, e.pollingDate, e.status as electionStatus
      FROM constituencies co
      LEFT JOIN elections e ON co.electionId = e.id
      WHERE co.id = ?
    `).get(id);

    if (!constituency) {
      return res.status(404).json({ success: false, error: 'Constituency not found' });
    }

    const candidates = db.prepare(`
      SELECT c.*, p.shortName as partyShortName, p.name as partyName, p.symbol as partySymbol, p.badgeBg as partyBadgeBg
      FROM candidates c
      LEFT JOIN parties p ON c.partyId = p.id
      WHERE c.constituencyId = ?
    `).all(id);

    res.json({
      success: true,
      data: {
        ...constituency,
        candidates,
        candidateCount: candidates.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
