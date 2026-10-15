import { Router } from 'express';
import { db } from '../db.js';

export const enquiriesRouter = Router();

// GET /api/enquiries - Retrieve all citizen voter enquiries
enquiriesRouter.get('/', (req, res) => {
  try {
    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC LIMIT 50').all();
    res.json({ success: true, data: enquiries, count: enquiries.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/enquiries - Submit citizen voter enquiry
enquiriesRouter.post('/', (req, res) => {
  try {
    const { name, phone, constituency, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Contact number / email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Enquiry message is required' });
    }

    const createdAt = new Date().toISOString();
    const insertStmt = db.prepare(`
      INSERT INTO enquiries (name, phone, constituency, message, createdAt, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      name.trim(),
      phone.trim(),
      (constituency || 'General Inquiry').trim(),
      message.trim(),
      createdAt,
      'Pending'
    );

    const newEnquiry = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      phone: phone.trim(),
      constituency: (constituency || 'General Inquiry').trim(),
      message: message.trim(),
      createdAt,
      status: 'Pending'
    };

    res.status(201).json({
      success: true,
      message: 'Citizen enquiry submitted successfully',
      data: newEnquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
