import { Router } from 'express';
import { db } from '../db';
import { dataSnapshot } from '../db/schema';

const router = Router();

router.post('/api/data-snapshot', async (req, res) => {
  try {
    const { fieldId, farmerInputs, remoteSensing } = req.body;

    if (!fieldId) {
      return res.status(400).json({ error: 'fieldId is required' });
    }

    if (!farmerInputs) {
      return res.status(400).json({ error: 'farmerInputs is required' });
    }

    if (!remoteSensing) {
      return res.status(400).json({ error: 'remoteSensing is required' });
    }

    // Create data snapshot
    const [newSnapshot] = await db
      .insert(dataSnapshot)
      .values({
        fieldId,
        farmerInputs,
        remoteSensing,
      })
      .returning();

    res.status(201).json(newSnapshot);
  } catch (error) {
    console.error('Error creating data snapshot:', error);
    res.status(500).json({ error: 'Failed to create data snapshot' });
  }
});

export default router;

