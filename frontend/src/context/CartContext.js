import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pulgax-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pulgax-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      // Check if same product with same options exists
      const existingIndex = prev.findIndex(
        i => i.product_id === item.product_id &&
             i.selected_color === item.selected_color &&
             i.selected_size === item.selected_size &&
             JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce((sum, item) => {
    // Use final_unit_price if available (includes all adjustments)
    if (item.final_unit_price) {
      return sum + (item.final_unit_price * item.quantity);
    }
    
    // Fallback to manual calculation
    const basePrice = item.price || 0;
    const sizeAdjustment = item.size_price_adjustment || 0;
    
    // Calculate customization adjustments
    const customizationAdjustment = Object.values(item.customization_price_adjustments || {})
      .reduce((total, adjustment) => total + (adjustment || 0), 0);
    
    const finalPrice = basePrice + sizeAdjustment + customizationAdjustment;
    return sum + (finalPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
