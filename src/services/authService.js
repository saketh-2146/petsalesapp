import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

class AuthService {
  /** Sign up with Email/Password + create Firestore user profile */
  async signUp(email, password, fullName, phone, role = 'Buyer') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      // Create user document in Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email,
        full_name: fullName,
        phone: phone || '',
        role,
        avatar_url: '',
        bio: '',
        created_at: serverTimestamp(),
      });

      return { data: { user }, error: null };
    } catch (error) {
      console.error('Error during sign up:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Login with Email/Password */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { data: { user: userCredential.user }, error: null };
    } catch (error) {
      console.error('Error during login:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Logout from Firebase */
  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Error during logout:', error.message);
      return { error: error.message };
    }
  }

  /** Google Sign-In with popup + upsert Firestore profile */
  async signInWithOAuth(provider) {
    try {
      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Upsert user doc in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            full_name: user.displayName || '',
            avatar_url: user.photoURL || '',
            role: 'Buyer',
            bio: '',
            created_at: serverTimestamp(),
          });
        }

        return { data: { user }, error: null };
      }
      return { data: null, error: 'Unsupported provider' };
    } catch (error) {
      console.error(`Error during ${provider} login:`, error.message);
      return { data: null, error: error.message };
    }
  }

  /** Get current Firebase user */
  getCurrentUser() {
    return auth.currentUser;
  }

  /** Get user profile from Firestore */
  async getUserProfile(userId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (!docSnap.exists()) return { data: null, error: 'User not found' };
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error getting user profile:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Update user profile in Firestore */
  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        updated_at: serverTimestamp(),
      });
      const updated = await getDoc(userRef);
      return { data: { id: updated.id, ...updated.data() }, error: null };
    } catch (error) {
      console.error('Error updating profile:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Upload avatar to Firebase Storage */
  async uploadAvatar(userId, file) {
    try {
      const fileExt = file.name.split('.').pop();
      const storageRef = ref(storage, `avatars/${userId}/avatar.${fileExt}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { url, error: null };
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      return { url: null, error: error.message };
    }
  }

  /** Get all users from Firestore (admin only) */
  async getAllUsers() {
    try {
      const q = query(collection(db, 'users'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching all users:', error.message);
      return { data: null, error: error.message };
    }
  }

  /** Send password reset email via Firebase */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      return { error: error.message };
    }
  }
}

export const authService = new AuthService();
