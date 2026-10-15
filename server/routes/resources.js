import { Router } from 'express';
import { db } from '../db.js';

export const resourcesRouter = Router();

// GET /api/resources - List civic guides, rules, and ECI resources
resourcesRouter.get('/', (req, res) => {
  try {
    const { category, search } = req.query;

    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id ASC';

    const resources = db.prepare(query).all(...params);
    res.json({ success: true, data: resources, count: resources.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
