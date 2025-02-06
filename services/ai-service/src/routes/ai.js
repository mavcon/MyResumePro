const express = require('express');
const aiService = require('../services/ai');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/rewrite-profile', authMiddleware, async (req, res, next) => {
  try {
    const { profile } = req.body;
    
    if (!profile) {
      return res.status(400).json({ 
        message: 'Profile data is required' 
      });
    }

    const rewrittenProfile = await aiService.rewriteProfile(profile);
    res.json({
      success: true,
      data: rewrittenProfile
    });
  } catch (error) {
    logger.error('Profile rewrite error:', error);
    next(error);
  }
});

router.post('/generate-cover-letter', authMiddleware, async (req, res, next) => {
  try {
    const { profile, jobDescription } = req.body;
    
    if (!profile || !jobDescription) {
      return res.status(400).json({ 
        message: 'Profile and job description are required' 
      });
    }

    const coverLetter = await aiService.generateCoverLetter(profile, jobDescription);
    res.json({
      success: true,
      data: coverLetter
    });
  } catch (error) {
    logger.error('Cover letter generation error:', error);
    next(error);
  }
});

module.exports = router; 