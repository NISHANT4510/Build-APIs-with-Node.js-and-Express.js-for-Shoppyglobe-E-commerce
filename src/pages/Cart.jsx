import { useEffect } from 'react';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

function Cart() {
  const { items, loading, fetchCart, updateQuantity, removeFromCart } = useCartStore();

  useEffect(() => {
    console.log('Fetching cart...');
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        Your cart is empty
      </div>
    );
  }

  console.log('Cart items:', items);

  return (
    <div className="space-y-4">
      {items.filter(item => item.product).map((item) => {
        console.log('Rendering item:', item);
        return (
          <div
            key={item.product._id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product?.image || 'https://via.placeholder.com/80?text=Product'}
                alt={item.product?.name || 'Product'}
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80?text=Product';
                }}
                loading="lazy"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.product?.name || 'Product Not Available'}</h3>
                <p className="text-gray-600">${(item.product?.price || 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 0) {
                    updateQuantity(item.product._id, value);
                  }
                }}
                className="w-20 rounded border p-1"
              />
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
      <div className="mt-4 text-right">
        <p className="text-xl font-bold">
          Total: ${items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default Cart;