// auth.js
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut
} from "firebase/auth";

// Signup with email/password
export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login with email/password
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Login with Google
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Logout
export const logout = () => {
  return signOut(auth);
};
