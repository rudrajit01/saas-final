import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf7iISiARMG41JpJ2PYnjjkN3LN6YYvzo",
  authDomain: "hjasdn-7a80d.firebaseapp.com",
  projectId: "hjasdn-7a80d",
  storageBucket: "hjasdn-7a80d.firebasestorage.app",
  messagingSenderId: "568570430591",
  appId: "1:568570430591:web:4017e6f1b129fd1ccd6b4a",
  measurementId: "G-692TSHQMP9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;