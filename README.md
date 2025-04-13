# ShoppyGlobe E-commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## Features

- 🛍️ Product browsing and search functionality
- 🔐 User authentication (JWT-based)
- 🛒 Shopping cart management
- 📱 Responsive design
- 🔍 Real-time search with debouncing
- 💳 Product quantity management

## Screenshots

### Get All Product
![Get All Product](/screenshots/getallproducts.png)
![Get All Product DB](/screenshots/getallproductdb.png)

### Get Single Product
![Get Single Product](/screenshots/getsingleproduct.png)
![Get Single Product DB](/screenshots/getsingledb.png)

### Post Cart
![Post Product](/screenshots/postcart.png)
![Post Product DB](/screenshots/postcartdb.png)

### Put Cart
![Put Product](/screenshots/putcart.png)
![Put Product DB](/screenshots/putcartdb.png)

### Delete Cart
![Delete Product](/screenshots/deletecart.png)
![Delete Product DB](/screenshots/deletecartdb.png)

## Tech Stack

### Frontend
- React
- React Router DOM
- Axios for API calls
- Zustand for state management
- Tailwind CSS for styling
- React Hot Toast for notifications
- Heroicons for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- CORS for cross-origin resource sharing

## Getting Started

1. **Clone the repository**
```bash
git clone [https://github.com/NISHANT4510/Build-APIs-with-Node.js-and-Express.js-for-Shoppyglobe-E-commerce.git]
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://127.0.0.1:27017/shoppyglobe
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the development server**
```bash
# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- GET `/api/products/search?q=term` - Search products

### Cart (Protected Routes)
- GET `/api/cart` - Get user's cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:productId` - Update cart item
- DELETE `/api/cart/:productId` - Remove item from cart

## Project Structure

```
project/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components
│   ├── store/         # Zustand store configurations
│   ├── routes/        # Express route handlers
│   ├── models/        # Mongoose models
│   ├── middleware/    # Express middlewares
│   └── scripts/       # Utility scripts (e.g., database seeding)
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
