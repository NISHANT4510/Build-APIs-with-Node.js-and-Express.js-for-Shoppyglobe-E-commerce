import create from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from './authStore';

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  
  fetchCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ items: [], loading: false });
      return;
    }

    try {
      set({ loading: true });
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out items with null products
      const validItems = response.data.items?.filter(item => item.product) || [];
      set({ items: validItems });
      
      if (validItems.length !== response.data.items?.length) {
        console.log('Some items were filtered out due to missing products');
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
      toast.error('Failed to fetch cart');
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.post('http://localhost:3000/api/cart', 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ items: response.data.items || [] });
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.put(`http://localhost:3000/api/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ items: response.data.items || [] });
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      // Refresh cart to ensure consistency
      get().fetchCart();
    }
  },

  removeFromCart: async (productId) => {
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.delete(`http://localhost:3000/api/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ items: response.data.items || [] });
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      // Refresh cart to ensure consistency
      get().fetchCart();
    }
  },
}));

export default useCartStore;