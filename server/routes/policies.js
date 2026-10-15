import { Router } from 'express';
import { db } from '../db.js';

export const policiesRouter = Router();

// GET /api/policies - List policies with topic/candidate/search filters
policiesRouter.get('/', (req, res) => {
  try {
    const { candidateId, topic, search } = req.query;

    let query = `
      SELECT 
        pol.*,
        c.name as candidateName,
        c.photo as candidatePhoto,
        p.id as partyId,
        p.name as partyName,
        p.shortName as partyShortName,
        p.symbol as partySymbol
      FROM policies pol
      LEFT JOIN candidates c ON pol.candidateId = c.id
      LEFT JOIN parties p ON c.partyId = p.id
      WHERE 1=1
    `;
    const params = [];

    if (candidateId && candidateId !== 'All') {
      query += ' AND pol.candidateId = ?';
      params.push(candidateId);
    }
    if (topic && topic !== 'All') {
      query += ' AND pol.topic = ?';
      params.push(topic);
    }
    if (search) {
      query += ' AND (pol.position LIKE ? OR pol.topic LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY pol.topic ASC, c.name ASC';

    const policies = db.prepare(query).all(...params);
    res.json({ success: true, data: policies, count: policies.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
