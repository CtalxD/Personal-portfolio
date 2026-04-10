import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXmvX-f60mf6vXRNyQS38s4C9Z_Ey4LQg",
  authDomain: "sital-portfolio.firebaseapp.com",
  projectId: "sital-portfolio",
  storageBucket: "sital-portfolio.firebasestorage.app",
  messagingSenderId: "24119286681",
  appId: "1:24119286681:web:b05f90fccfb8a78ae81108",
  measurementId: "G-RGXNB8F9FY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);