'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('localkart_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            // Token expired or invalid
            localStorage.removeItem('localkart_token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [API_URL]);

  const login = async (emailOrPhone, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrPhone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('localkart_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendOtp = async (name, email, phone, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      return { success: true, message: data.message, simulated: data.simulated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, phone, password, otp, role = 'customer') => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password, otp, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('localkart_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        fcmToken: data.fcmToken
      });
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateFcmToken = async (fcmToken) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_URL}/auth/fcm-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fcmToken })
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, fcmToken: data.fcmToken } : prev));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('localkart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setUser, sendOtp, updateFcmToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
