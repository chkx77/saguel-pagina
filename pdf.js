import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, doc,
  getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, writeBatch
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

let db = null
const isConfigured = firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('tu_')

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (e) {
    console.warn('Firebase init:', e.message)
  }
}

export {
  db, collection, doc,
  getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, writeBatch
}
export const firebaseReady = !!db
