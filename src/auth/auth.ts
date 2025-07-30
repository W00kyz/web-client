import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

interface AuthResult {
  success: boolean;
  user: User | null;
  token?: string;
  error: string | null;
}

// Sign in with Google functionality
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    await setPersistence(firebaseAuth, browserSessionPersistence);
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const token = await result.user.getIdToken();
    return {
      success: true,
      user: result.user,
      token,
      error: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Sign in with GitHub functionality
export const signInWithGithub = async (): Promise<AuthResult> => {
  try {
    await setPersistence(firebaseAuth, browserSessionPersistence);
    const result = await signInWithPopup(firebaseAuth, githubProvider);
    return {
      success: true,
      user: result.user,
      error: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Sign in with email and password
export async function signInWithCredentials(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    await setPersistence(firebaseAuth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    return {
      success: true,
      user: userCredential.user,
      token,
      error: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      user: null,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to sign in with email/password',
    };
  }
}

// Sign out functionality
export const firebaseSignOut = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Auth state observer
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseAuth.onAuthStateChanged(callback);
};
