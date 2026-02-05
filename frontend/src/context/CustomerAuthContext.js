import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('pulgax-customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [customerToken, setCustomerToken] = useState(() => {
    return localStorage.getItem('pulgax-customer-token') || null;
  });

  const [isValidating, setIsValidating] = useState(false);

  // Validate token on mount and when token changes
  useEffect(() => {
    const validateToken = async () => {
      if (!customerToken || !customer) {
        return;
      }

      try {
        setIsValidating(true);
        // Try to fetch customer profile to validate token
        await api.getCustomerProfile();
        console.log('Customer token is valid');
      } catch (error) {
        console.error('Customer token validation failed:', error);
        // Token is invalid, clear auth state
        logoutCustomer();
      } finally {
        setIsValidating(false);
      }
    };

    // Only validate if we have both token and customer data
    if (customerToken && customer) {
      validateToken();
    }
  }, []); // Remove customerToken dependency to avoid infinite loops

  useEffect(() => {
    if (customer) {
      localStorage.setItem('pulgax-customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('pulgax-customer');
    }
  }, [customer]);

  useEffect(() => {
    if (customerToken) {
      localStorage.setItem('pulgax-customer-token', customerToken);
    } else {
      localStorage.removeItem('pulgax-customer-token');
    }
  }, [customerToken]);

  const loginCustomer = (customerData, accessToken) => {
    console.log('Logging in customer:', customerData.email);
    setCustomer(customerData);
    setCustomerToken(accessToken);
  };

  const logoutCustomer = () => {
    console.log('Logging out customer');
    setCustomer(null);
    setCustomerToken(null);
    localStorage.removeItem('pulgax-customer');
    localStorage.removeItem('pulgax-customer-token');
  };

  const isCustomerAuthenticated = !!customerToken && !!customer && !isValidating;

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      customerToken,
      loginCustomer,
      logoutCustomer,
      isCustomerAuthenticated,
      isValidating
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};