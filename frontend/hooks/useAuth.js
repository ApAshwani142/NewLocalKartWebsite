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

  const loginWithFirebaseToken = async (idToken, extraData = {}) => {
    try {
      const res = await fetch(`${API_URL}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idToken,
          name: extraData.name,
          role: extraData.role || 'customer',
          email: extraData.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Firebase login verification failed');
      }

      // Store custom application JWT
      localStorage.setItem('localkart_token', data.token);
      setToken(data.token);
      setUser(data.user);

      // Role-based redirection path
      let redirectPath = '/';
      if (data.user.role === 'shopkeeper') {
        redirectPath = '/partner/dashboard';
      } else if (data.user.role === 'delivery_agent') {
        redirectPath = '/partner/delivery';
      } else if (data.user.role === 'admin') {
        redirectPath = '/admin/dashboard';
      }

      return { success: true, user: data.user, token: data.token, redirectPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithSupabaseToken = async (accessToken, extraData = {}) => {
    try {
      const res = await fetch(`${API_URL}/auth/supabase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken,
          supabaseUid: extraData.supabaseUid,
          email: extraData.email,
          name: extraData.name,
          phone: extraData.phone,
          role: extraData.role || 'customer'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Supabase login verification failed');
      }

      localStorage.setItem('localkart_token', data.token);
      setToken(data.token);
      setUser(data.user);

      let redirectPath = '/';
      if (data.user.role === 'shopkeeper') {
        redirectPath = '/partner/dashboard';
      } else if (data.user.role === 'delivery_agent') {
        redirectPath = '/partner/delivery';
      } else if (data.user.role === 'admin') {
        redirectPath = '/admin/dashboard';
      }

      return { success: true, user: data.user, token: data.token, redirectPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithSupabase = async (email, password) => {
    try {
      const { supabaseSignInWithEmail } = await import('@/lib/supabaseClient');
      const data = await supabaseSignInWithEmail(email, password);

      const accessToken = data.session?.access_token;
      const sbUser = data.user;

      return await loginWithSupabaseToken(accessToken, {
        supabaseUid: sbUser?.id,
        email: sbUser?.email,
        name: sbUser?.user_metadata?.full_name || sbUser?.user_metadata?.name,
        role: sbUser?.user_metadata?.role
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signupWithSupabase = async (email, password, name, phone, role = 'customer') => {
    try {
      const { supabaseSignUpWithEmail } = await import('@/lib/supabaseClient');
      const data = await supabaseSignUpWithEmail(email, password, { full_name: name, phone, role });

      const accessToken = data.session?.access_token;
      const sbUser = data.user;

      return await loginWithSupabaseToken(accessToken, {
        supabaseUid: sbUser?.id || `sb_${Date.now()}`,
        email,
        name,
        phone,
        role
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { supabaseSignOut } = await import('@/lib/supabaseClient');
      await supabaseSignOut();
    } catch (e) {
      console.warn('Supabase logout warning:', e.message);
    }
    localStorage.removeItem('localkart_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithFirebaseToken,
        loginWithSupabase,
        loginWithSupabaseToken,
        signupWithSupabase,
        signup,
        logout,
        setUser,
        sendOtp,
        updateFcmToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
