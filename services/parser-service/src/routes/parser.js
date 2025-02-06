const express = require('express');
const { parseResume, parseText } = require('../services/parser');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: '/tmp/uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/plain',
    'application/vnd.oasis.opendocument.text',
    'text/markdown',
    'application/x-iwork-pages-sffpages'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a valid resume file.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/parse-resume', authMiddleware, async (req, res, next) => {
  try {
    const { fileBuffer, fileType } = req.body;
    
    if (!fileBuffer || !fileType) {
      return res.status(400).json({ 
        message: 'File buffer and type are required' 
      });
    }

    const parsedData = await parseResume(fileBuffer, fileType);
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    next(error);
  }
});

router.post('/parse-text', authMiddleware, async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        message: 'Text content is required' 
      });
    }

    const parsedData = await parseText(text);
    res.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 