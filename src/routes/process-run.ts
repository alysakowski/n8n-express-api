import { eq } from 'drizzle-orm';
import { Router } from 'express';
import { db } from '../db';
import { fieldProcessingStatus, processRun } from '../db/schema';

const router = Router();

const n8nBaseUrl = process.env.N8N_BASE_URL || "http://localhost:5678"

router.post('/api/process-run', async (req, res) => {
  try {
    const { fieldId, workflowMetadata } = req.body;

    if (!fieldId) {
      return res.status(400).json({ error: 'fieldId is required' });
    }

    // Validate workflowMetadata structure if provided
    if (workflowMetadata) {
      if (
        typeof workflowMetadata.workflowId !== 'string' ||
        typeof workflowMetadata.executionId !== 'string'
      ) {
        return res.status(400).json({
          error:
            'workflowMetadata must contain workflowId (string) and executionId (string)',
        });
      }
    }

    // Create fieldProcessingStatus with PENDING status
    const [newFieldProcessingStatus] = await db
      .insert(fieldProcessingStatus)
      .values({
        fieldId,
        status: 'PENDING',
      })
      .returning();

    // Create processRun linked to the fieldProcessingStatus
    const [newProcessRun] = await db
      .insert(processRun)
      .values({
        fieldId,
        fieldProcessingStatusId: newFieldProcessingStatus.id,
        workflowMetadata: workflowMetadata || null,
      })
      .returning();

    res.status(201).json(newProcessRun);
  } catch (error) {
    console.error('Error creating process run:', error);
    res.status(500).json({ error: 'Failed to create process run' });
  }
});

router.put('/api/process-run/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Process run ID is required' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validate status is one of the allowed enum values
    const validStatuses = [
      'PENDING',
      'STARTED',
      'DATA_FETCH_FAILED',
      'VALIDATING',
      'RUNNING_CHECKS',
      'COMPLETED',
      'FAILED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Update the process run status
    const [updatedProcessRun] = await db
      .update(processRun)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(processRun.id, Number.parseInt(id, 10)))
      .returning();

    if (!updatedProcessRun) {
      return res.status(404).json({ error: 'Process run not found' });
    }

    res.json(updatedProcessRun);
  } catch (error) {
    console.error('Error updating process run:', error);
    res.status(500).json({ error: 'Failed to update process run' });
  }
});

router.get('/api/process-run/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Process run ID is required' });
    }

    // Retrieve the process run by ID
    const [selectedProcessRun] = await db
      .select()
      .from(processRun)
      .where(eq(processRun.id, Number.parseInt(id, 10)));

    if (!selectedProcessRun) {
      return res.status(404).json({ error: 'Process run not found' });
    }

    type ExtendedResponse = typeof selectedProcessRun & {
      n8nExecutionUrl?: string;
    };

    // Add an n8n execution URL
    const { workflowId, executionId } = selectedProcessRun.workflowMetadata || {};
    const n8nExecutionUrl = `${n8nBaseUrl}workflow/${workflowId}/executions/${executionId}`;
    const extendedResponse: ExtendedResponse = {
      ...selectedProcessRun,
      n8nExecutionUrl,

    }
    
    res.json(extendedResponse);
  } catch (error) {
    console.error('Error getting process run:', error);
    res.status(500).json({ error: 'Failed to get process run' });
  }
});

export default router;

