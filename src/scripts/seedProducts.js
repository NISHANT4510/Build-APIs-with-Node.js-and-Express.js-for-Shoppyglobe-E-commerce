import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const sampleProducts = [
  {
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    price: 699.99,
    stockQuantity: 50,
    image: "https://i.imgur.com/CQZHZgK.jpg"
  },
  {
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    stockQuantity: 30,
    image: "https://i.imgur.com/KKCaSgJ.jpg"
  },
  {
    name: "Wireless Earbuds",
    description: "Premium wireless earbuds with noise cancellation",
    price: 149.99,
    stockQuantity: 100,
    image: "https://i.imgur.com/LGk2Jn5.jpg"
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 249.99,
    stockQuantity: 45,
    image: "https://i.imgur.com/Kx4AI5E.jpg"
  },
  {
    name: "4K Monitor",
    description: "Ultra-sharp 4K display for immersive viewing",
    price: 399.99,
    stockQuantity: 25,
    image: "https://i.imgur.com/e6OoHK7.jpg"
  },
  {
    name: "Gaming Console",
    description: "Next-gen gaming console for ultimate entertainment",
    price: 499.99,
    stockQuantity: 35,
    image: "https://i.imgur.com/HJWdEKF.jpg"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log('Added sample products:', insertedProducts);

    mongoose.disconnect();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedProducts();