import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(id, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-600">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-cover md:w-96"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  product.name
                )}&size=200&background=random`;
              }}
              loading="lazy"
            />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
              <p className="mt-2 text-sm text-gray-600">
                Stock Available: {product.stockQuantity}
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <input
                type="number"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stockQuantity))}
                className="w-20 rounded border-gray-300 shadow-sm"
              />
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
