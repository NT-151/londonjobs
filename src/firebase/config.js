import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCDqBb8ZvNXp5CRFi30FDFstun55ZIr5Y",
  authDomain: "londonretailjobs.firebaseapp.com",
  projectId: "londonretailjobs",
  storageBucket: "londonretailjobs.appspot.com",
  messagingSenderId: "597218236455",
  appId: "1:597218236455:web:5cbea0201e77e83f645602",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const database = getFirestore(app);
