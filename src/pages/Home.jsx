import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const token = useAuthStore((state) => state.token);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      } else {
        fetchProducts();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (term) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/search?q=${term}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    }
  };

  const handleAddToCart = (productId) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link to={`/product/${product._id}`} className="block">
              <div className="relative w-full h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image for ${product.name}:`, product.image);
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      product.name
                    )}&size=200&background=random`;
                  }}
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold hover:text-blue-600">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stockQuantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product._id);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                      disabled={product.stockQuantity === 0}
                    >
                      {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;