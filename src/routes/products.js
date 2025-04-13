import express from 'express';
import { param, query, validationResult } from 'express-validator';
import { Product } from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Search products - Must come BEFORE /:id route
router.get('/search', [
  query('q').trim().escape().notEmpty().withMessage('Search query cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get single product - Must come AFTER /search route
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid product ID format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add logging to debug
    console.log('Fetching product with ID:', req.params.id);
    
    const product = await Product.findById(req.params.id);
    console.log('Found product:', product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

export default router;