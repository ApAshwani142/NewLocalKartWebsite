import { admin, initFirebaseAdmin, isInitialized } from '../config/firebaseAdmin.js';

// Ensure Firebase Admin is initialized
initFirebaseAdmin();

/**
 * Verify Firebase ID Token using Firebase Admin SDK
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded Firebase token payload (uid, phone_number, email)
 */
async function verifyFirebaseIdToken(idToken) {
  if (!idToken) {
    throw new Error('Firebase ID Token is required');
  }

  // If Firebase Admin SDK is fully configured with service account
  if (admin && admin.apps && admin.apps.length > 0) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        uid: decodedToken.uid,
        phone: decodedToken.phone_number || decodedToken.phone || '',
        email: decodedToken.email || '',
        name: decodedToken.name || ''
      };
    } catch (error) {
      console.error('[FirebaseService] ID Token verification failed:', error.message);
      throw new Error(`Invalid Firebase ID Token: ${error.message}`);
    }
  }

  // Fallback for development / automated testing mode when credentials env is not set
  console.log('[FirebaseService] Demo/Dev Token verification active...');
  try {
    // In dev mode, if token is JSON string or formatted token
    if (idToken.startsWith('{')) {
      const parsed = JSON.parse(idToken);
      return {
        uid: parsed.uid || `fb_dev_${Date.now()}`,
        phone: parsed.phone || '9998887771',
        email: parsed.email || 'user@example.com',
        name: parsed.name || 'Demo User'
      };
    }
  } catch (e) {
    // continue
  }

  return {
    uid: `fb_uid_${idToken.substring(0, 10)}_${Date.now()}`,
    phone: idToken.length >= 10 ? idToken : '9998887771',
    email: '',
    name: 'Firebase Verified User'
  };
}

export {
  verifyFirebaseIdToken
};
