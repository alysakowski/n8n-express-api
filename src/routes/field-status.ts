import { eq } from 'drizzle-orm';
import { Router } from 'express';
import { db } from '../db';
import { fieldProcessingStatus } from '../db/schema';

const router = Router();

router.put('/api/field-status', async (req, res) => {
  try {
    const { fieldId, status } = req.body;

    if (!fieldId) {
      return res.status(400).json({ error: 'fieldId is required' });
    }

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    // Validate status is one of the allowed enum values
    const validStatuses = ['PENDING', 'DATA_MISSING', 'APPROVAL', 'NON_COMPLIANCE'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Update the field status
    const [updatedFieldStatus] = await db
      .update(fieldProcessingStatus)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(fieldProcessingStatus.fieldId, fieldId))
      .returning();

    if (!updatedFieldStatus) {
      return res.status(404).json({ error: 'Field status not found' });
    }

    res.json(updatedFieldStatus);
  } catch (error) {
    console.error('Error updating field status:', error);
    res.status(500).json({ error: 'Failed to update field status' });
  }
});

export default router;

