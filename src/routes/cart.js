import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validate cart items
const validateCartOperation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('productId').isMongoId().withMessage('Invalid product ID format'),
];

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching cart for user:', req.user.userId);
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      console.log('No cart found, returning empty items');
      return res.json({ items: [] });
    }

    // Properly populate the products
    await cart.populate({
      path: 'items.product',
      select: 'name price image stockQuantity'
    });
    
    // Filter out any items where product is null (in case product was deleted)
    cart.items = cart.items.filter(item => item.product != null);
    await cart.save();
    
    console.log('Cart found:', JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
});

// Add to cart
router.post('/', [auth, ...validateCartOperation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock',
        available: product.stockQuantity 
      });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.status(201).json(populatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
});

// Update cart item
router.put('/:productId', [
  auth,
  param('productId').isMongoId().withMessage('Invalid product ID format'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
});

// Remove from cart
router.delete('/:productId', [
  auth,
  param('productId').isMongoId().withMessage('Invalid product ID format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== req.params.productId
    );

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
});

export default router;