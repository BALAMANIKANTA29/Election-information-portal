import { Router } from 'express';
import { db } from '../db.js';

export const partiesRouter = Router();

// GET /api/parties - List all political parties
partiesRouter.get('/', (req, res) => {
  try {
    const { search } = req.query;

    let query = 'SELECT * FROM parties WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR shortName LIKE ? OR ideology LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY foundedYear ASC';

    const parties = db.prepare(query).all(...params);

    // Attach candidate counts to each party
    const candidatesCountByParty = db.prepare(`
      SELECT partyId, count(*) as count FROM candidates GROUP BY partyId
    `).all();
    const countMap = Object.fromEntries(candidatesCountByParty.map(r => [r.partyId, r.count]));

    const enrichedParties = parties.map(p => ({
      ...p,
      candidateCount: countMap[p.id] || 0
    }));

    res.json({ success: true, data: enrichedParties, count: enrichedParties.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/parties/:id - Get specific party details with affiliated candidates
partiesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const party = db.prepare('SELECT * FROM parties WHERE id = ?').get(id);

    if (!party) {
      return res.status(404).json({ success: false, error: 'Party not found' });
    }

    const candidates = db.prepare(`
      SELECT c.*, co.name as constituencyName, co.state as constituencyState, e.name as electionName
      FROM candidates c
      LEFT JOIN constituencies co ON c.constituencyId = co.id
      LEFT JOIN elections e ON c.electionId = e.id
      WHERE c.partyId = ?
    `).all(id);

    res.json({
      success: true,
      data: {
        ...party,
        candidates,
        candidateCount: candidates.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
