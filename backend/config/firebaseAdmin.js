let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  admin = null;
}

let firebaseApp = null;
let isInitialized = false;

function initFirebaseAdmin() {
  if (!admin) {
    console.warn('[FirebaseAdmin Config] firebase-admin module not loaded.');
    return null;
  }

  if (admin.apps && admin.apps.length > 0) {
    isInitialized = true;
    return admin.apps[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  try {
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isInitialized = true;
      console.log('[FirebaseAdmin Config] Initialized using FIREBASE_SERVICE_ACCOUNT_KEY env var.');
    } else if (credentialsPath) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(require(credentialsPath))
      });
      isInitialized = true;
      console.log(`[FirebaseAdmin Config] Initialized using credentials file at ${credentialsPath}`);
    } else if (projectId) {
      firebaseApp = admin.initializeApp({
        projectId
      });
      isInitialized = true;
      console.log(`[FirebaseAdmin Config] Initialized using default credentials for project ${projectId}`);
    } else {
      console.log('[FirebaseAdmin Config] No Firebase credentials provided. Running in Demo/Dev verification mode.');
    }
  } catch (err) {
    console.error('[FirebaseAdmin Config] Initialization Error:', err.message);
  }

  return firebaseApp;
}

module.exports = {
  admin,
  initFirebaseAdmin,
  isInitialized: () => isInitialized
};
