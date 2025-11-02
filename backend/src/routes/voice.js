import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for audio files
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/webm'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'), false);
    }
  },
});

// Mock transcription service (replace with actual service)
const transcribeAudio = async (audioBuffer, language = 'en') => {
  // This is a mock implementation
  // In production, integrate with Google Cloud Speech-to-Text, OpenAI Whisper, etc.

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

  const mockTranscriptions = {
    en: 'I create beautiful handcrafted pottery using traditional methods passed down through generations. Each piece is unique and tells a story of our cultural heritage.',
    hi: 'मैं पारंपरिक तरीकों का उपयोग करके सुंदर हस्तशिल्प मिट्टी के बर्तन बनाता हूं। हर टुकड़ा अनोखा है और हमारी सांस्कृतिक विरासत की कहानी कहता है।',
    hinglish:
      'Main traditional methods use karke beautiful handcrafted pottery banata hun. Har piece unique hai aur hamari cultural heritage ki story batata hai.',
  };

  return {
    transcription: mockTranscriptions[language] || mockTranscriptions['en'],
    confidence: 0.95,
    language: language,
    duration: Math.random() * 60 + 30, // Random duration between 30-90 seconds
  };
};

// Mock AI product generation service
const generateProductFromVoice = async (
  transcription,
  language = 'en',
  artisanId
) => {
  // This is a mock implementation
  // In production, integrate with OpenAI GPT, Google Vertex AI, etc.

  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing time

  const productTemplates = {
    en: {
      title: 'Handcrafted Traditional Pottery Bowl',
      description: `${transcription}\n\nThis beautiful piece represents hours of skilled craftsmanship and attention to detail. Made using time-honored techniques, each bowl is fired at high temperatures to ensure durability while maintaining its artistic integrity.`,
      category: 'home-decor',
      materials: ['Clay', 'Natural Glaze', 'Organic Pigments'],
      tags: ['handmade', 'pottery', 'traditional', 'ceramic', 'artisan'],
      craftingTime: '3-5 days',
      price: Math.floor(Math.random() * 3000) + 1500, // Random price between 1500-4500
    },
    hi: {
      title: 'हस्तनिर्मित पारंपरिक मिट्टी का कटोरा',
      description: `${transcription}\n\nयह सुंदर कृति घंटों की कुशल शिल्पकारी और विस्तार पर ध्यान का प्रतिनिधित्व करती है। समय-सम्मानित तकनीकों का उपयोग करके बनाया गया, प्रत्येक कटोरे को उच्च तापमान पर पकाया जाता है।`,
      category: 'home-decor',
      materials: ['मिट्टी', 'प्राकृतिक ग्लेज़', 'जैविक रंगद्रव्य'],
      tags: ['हस्तनिर्मित', 'मिट्टी के बर्तन', 'पारंपरिक', 'सिरामिक', 'कारीगर'],
      craftingTime: '3-5 दिन',
      price: Math.floor(Math.random() * 3000) + 1500,
    },
    hinglish: {
      title: 'Handcrafted Traditional Pottery Bowl - Haath se bana',
      description: `${transcription}\n\nYe beautiful piece hours ki skilled craftsmanship aur attention to detail ko represent karta hai. Time-honored techniques use karke banaya gaya, har bowl ko high temperature mein fire kiya jata hai.`,
      category: 'home-decor',
      materials: ['Clay', 'Natural Glaze', 'Organic Pigments'],
      tags: ['handmade', 'pottery', 'traditional', 'haath-se-bana', 'artisan'],
      craftingTime: '3-5 days',
      price: Math.floor(Math.random() * 3000) + 1500,
    },
  };

  const template = productTemplates[language] || productTemplates['en'];

  return {
    ...template,
    id: uuidv4(),
    artisan_id: artisanId,
    status: 'draft', // Start as draft
    stock: Math.floor(Math.random() * 20) + 5, // Random stock 5-25
    currency: 'INR',
    voice_story: {
      originalTranscription: transcription,
      language: language,
      generatedAt: new Date().toISOString(),
    },
    ai_generated_content: {
      model: 'mock-ai-v1',
      confidence: 0.87,
      generatedAt: new Date().toISOString(),
    },
  };
};

// Transcribe audio file
router.post(
  '/transcribe',
  [
    upload.single('audio'),
    body('language')
      .optional()
      .isIn(['en', 'hi', 'hinglish'])
      .withMessage('Invalid language'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      const language = req.body.language || 'en';

      // Process the audio file
      const result = await transcribeAudio(req.file.buffer, language);

      res.json({
        success: true,
        ...result,
        fileInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error('Transcribe audio error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  }
);

// Generate product from voice transcription
router.post(
  '/generate',
  [
    body('transcription')
      .isString()
      .notEmpty()
      .withMessage('Transcription is required'),
    body('language')
      .optional()
      .isIn(['en', 'hi', 'hinglish'])
      .withMessage('Invalid language'),
    body('artisan_id').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      const { transcription, language = 'en', artisan_id } = req.body;

      // Generate product data from transcription
      const productData = await generateProductFromVoice(
        transcription,
        language,
        artisan_id
      );

      res.json({
        success: true,
        product: productData,
        message: 'Product generated successfully from voice input',
      });
    } catch (error) {
      console.error('Generate product error:', error);
      res.status(500).json({ error: 'Failed to generate product from voice' });
    }
  }
);

// Generate and save product (authenticated artisan only)
router.post(
  '/generate-and-save',
  [
    authenticateToken,
    requireRole('artisan'),
    body('transcription')
      .isString()
      .notEmpty()
      .withMessage('Transcription is required'),
    body('language')
      .optional()
      .isIn(['en', 'hi', 'hinglish'])
      .withMessage('Invalid language'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      const { transcription, language = 'en' } = req.body;

      // Generate product data
      const productData = await generateProductFromVoice(
        transcription,
        language,
        req.user.uid
      );

      // Save to Firestore
      const { getFirestore } = await import('../config/firebase.js');
      const db = getFirestore();

      const productWithTimestamps = {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        sold: 0,
      };

      await db
        .collection('products')
        .doc(productData.id)
        .set(productWithTimestamps);

      res.status(201).json({
        success: true,
        product: productWithTimestamps,
        message: 'Product generated and saved successfully',
      });
    } catch (error) {
      console.error('Generate and save product error:', error);
      res.status(500).json({ error: 'Failed to generate and save product' });
    }
  }
);

// Voice-to-shop complete workflow
router.post(
  '/voice-to-shop',
  [
    authenticateToken,
    requireRole('artisan'),
    upload.single('audio'),
    body('language')
      .optional()
      .isIn(['en', 'hi', 'hinglish'])
      .withMessage('Invalid language'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      const language = req.body.language || 'en';

      // Step 1: Transcribe audio
      const transcriptionResult = await transcribeAudio(
        req.file.buffer,
        language
      );

      // Step 2: Generate product from transcription
      const productData = await generateProductFromVoice(
        transcriptionResult.transcription,
        language,
        req.user.uid
      );

      // Step 3: Save to Firestore
      const { getFirestore } = await import('../config/firebase.js');
      const db = getFirestore();

      const productWithTimestamps = {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        sold: 0,
      };

      await db
        .collection('products')
        .doc(productData.id)
        .set(productWithTimestamps);

      res.status(201).json({
        success: true,
        transcription: transcriptionResult,
        product: productWithTimestamps,
        message: 'Voice successfully converted to product listing',
        workflow: {
          step1: 'Audio transcribed',
          step2: 'Product generated with AI',
          step3: 'Product saved to database',
        },
      });
    } catch (error) {
      console.error('Voice-to-shop workflow error:', error);
      res
        .status(500)
        .json({ error: 'Failed to complete voice-to-shop workflow' });
    }
  }
);

export default router;
