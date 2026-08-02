import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy_demo_key_placeholder_localkart",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "localkart-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "localkart-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "localkart-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app;
let auth;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
}

/**
 * Initialize invisible/visible RecaptchaVerifier for Phone Auth
 */
export const initRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined' || !auth) return null;

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[FirebaseClient] Recaptcha verified automatically.');
      },
      'expired-callback': () => {
        console.warn('[FirebaseClient] Recaptcha expired.');
      }
    });
  }

  return window.recaptchaVerifier;
};

/**
 * Send Phone OTP via Firebase Web SDK
 */
export const sendPhoneOtp = async (phoneNumber, containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined' || !auth) {
    throw new Error('Firebase Auth is only available in browser environment');
  }

  const verifier = initRecaptcha(containerId);
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult };
  } catch (error) {
    console.error('[FirebaseClient] Phone OTP Error:', error.message);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    throw error;
  }
};

/**
 * Verify OTP Code and get Firebase ID Token
 */
export const verifyOtpAndGetToken = async (otpCode, confirmationResult) => {
  const activeConfirmation = confirmationResult || (typeof window !== 'undefined' ? window.confirmationResult : null);

  if (!activeConfirmation) {
    throw new Error('No active OTP session found. Please request a new OTP.');
  }

  const userCredential = await activeConfirmation.confirm(otpCode);
  const firebaseUser = userCredential.user;

  // Retrieve Firebase ID Token
  const idToken = await firebaseUser.getIdToken(true);

  return {
    firebaseUser,
    idToken,
    phone: firebaseUser.phoneNumber
  };
};

/**
 * Request FCM Push Notification Permission & Device Token
 */
export const requestFcmToken = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const { getMessaging, getToken } = await import('firebase/messaging');
      const messaging = getMessaging(app);
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      return fcmToken;
    }
  } catch (error) {
    console.warn('[FirebaseClient] FCM Token fetch warning:', error.message);
  }

  return null;
};

export { app, auth };
