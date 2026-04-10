import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { PortfolioData } from '../types';

const PORTFOLIO_DOC_ID = 'portfolio-data';

export const portfolioService = {
  // Save portfolio data to Firebase
  async saveToFirebase(data: PortfolioData): Promise<void> {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    await setDoc(docRef, data, { merge: true });
  },

  // Load portfolio data from Firebase
  async loadFromFirebase(): Promise<PortfolioData | null> {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    return null;
  },

  // Real-time listener for changes
  subscribeToChanges(callback: (data: PortfolioData) => void): () => void {
    const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as PortfolioData);
      }
    });
  }
};