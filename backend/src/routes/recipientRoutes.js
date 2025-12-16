import { Router } from 'express';
import Recipient from '../models/Recipient.js';

const router = Router(); // ⬅️ This line was missing

// GET all recipients
router.get('/', async (req, res) => {
  try {
    const recipients = await Recipient.findAll();
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new recipient
router.post('/', async (req, res) => {
  try {
    const newRecipient = await Recipient.create(req.body);
    res.status(201).json(newRecipient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET one recipient by ID
router.get('/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findByPk(req.params.id);
    if (recipient) {
      res.json(recipient);
    } else {
      res.status(404).json({ message: 'Recipient not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a recipient by ID
router.delete('/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findByPk(req.params.id);
    if (recipient) {
      await recipient.destroy();
      res.json({ message: 'Recipient deleted successfully' });
    } else {
      res.status(404).json({ message: 'Recipient not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;