import { Router } from 'express';
import remoteSensing from '../../data/remote-sensing.json';

const router = Router();

router.get('/api/remote-sensing/:fieldId', (req, res) => {
  const { fieldId } = req.params;

  if (!fieldId) {
    return res.status(404).json({ error: 'Field not found' });
  }

  res.json(remoteSensing);
});

export default router;

