import { Router } from 'express';
import farmerInputs from '../../data/farmer-inputs.json';

const router = Router();

router.get('/api/farmer-inputs', (req, res) => {
  res.json(farmerInputs);
});

router.get('/api/farmer-inputs/:fieldId', (req, res) => {
  const { fieldId } = req.params;
  const field = farmerInputs.inputs.find((input) => input.fieldId === fieldId);

  if (!field) {
    return res.status(404).json({ error: 'Field not found' });
  }

  res.json(field);
});

export default router;

