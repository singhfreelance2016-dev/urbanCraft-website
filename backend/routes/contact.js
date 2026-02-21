const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// POST submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const submission = new Contact(req.body);
    await submission.save();
    
    // Here you could also send an email notification
    
    res.status(201).json({ 
      message: 'Thank you for contacting us! We\'ll respond within 24 hours.' 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all submissions (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const submissions = await Contact.find().sort('-createdAt');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update submission status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE submission (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Contact.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;