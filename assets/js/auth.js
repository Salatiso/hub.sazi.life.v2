// hub.sazi.life.v2/assets/js/auth.js

// Import services from your firebase-config.js
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- UI Elements ---
const authForm = document.getElementById('auth-form');
const googleBtn = document.getElementById('google-signin-btn');
const anonBtn = document.getElementById('anonymous-signin-btn');
const messageArea = document.getElementById('message-area');
const formTitle = document.getElementById('form-title');
const formToggleLink = document.getElementById('form-toggle-link');
const submitButton = document.getElementById('submit-button');
const confirmPasswordContainer = document.getElementById('confirm-password-container');
const nameContainer = document.getElementById('name-container');
const loadingOverlay = document.getElementById('loading-overlay');

let isSignUp = false;

// --- Loading and Message Functions ---
const showLoading = (isLoading) => {
    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        loadingOverlay.classList.add('hidden');
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
};

const showMessage = (message, isError = false) => {
    if (!messageArea) return;
    messageArea.textContent = message;
    messageArea.className = `text-center p-3 mb-4 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
};

// --- Core Auth Logic ---
const handleAuthSuccess = async (userCredential) => {
    const user = userCredential.user;
    // If it's a new user (or first time with Google), create a Firestore doc
    if (user.metadata.creationTime === user.metadata.lastSignInTime || isSignUp) {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName || document.getElementById('name')?.value || 'Anonymous User',
            email: user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
    }
    showMessage("Success! Redirecting to your dashboard...", false);
    setTimeout(() => {
        window.location.href = 'index-modules.html';
    }, 1500);
};

const toggleFormMode = () => {
    isSignUp = !isSignUp;
    authForm.reset();
    messageArea.innerHTML = '';
    
    formTitle.textContent = isSignUp ? 'Create an Account' : 'Sign In';
    submitButton.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    formToggleLink.textContent = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
    
    nameContainer.classList.toggle('hidden', !isSignUp);
    confirmPasswordContainer.classList.toggle('hidden', !isSignUp);
};

// --- Event Listeners ---
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading(true);
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            if (isSignUp) {
                const name = document.getElementById('name').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                if (!name) {
                    throw new Error("Please enter your full name.");
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                await handleAuthSuccess(userCredential);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await handleAuthSuccess(userCredential);
            }
        } catch (error) {
            let friendlyMessage = "An unexpected error occurred. Please try again.";
            if (error.message) friendlyMessage = error.message; // Use custom errors first
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-credential': friendlyMessage = "Invalid email or password. Please try again."; break;
                    case 'auth/email-already-in-use': friendlyMessage = "An account with this email already exists. Please sign in."; break;
                    case 'auth/weak-password': friendlyMessage = "Password must be at least 6 characters long."; break;
                }
            }
            showMessage(friendlyMessage, true);
        } finally {
            showLoading(false);
        }
    });
}

if (formToggleLink) {
    formToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFormMode();
    });
}

const socialSignIn = async (provider) => {
    showLoading(true);
    try {
        const result = await signInWithPopup(auth, provider);
        await handleAuthSuccess(result);
    } catch (error) {
        showMessage("Could not sign in with provider. Please try again.", true);
        console.error("Social Sign-In Error:", error);
    } finally {
        showLoading(false);
    }
};

if (googleBtn) {
    googleBtn.addEventListener('click', () => socialSignIn(new GoogleAuthProvider()));
}

if (anonBtn) {
    anonBtn.addEventListener('click', async () => {
        showLoading(true);
        try {
            const userCredential = await signInAnonymously(auth);
            await handleAuthSuccess(userCredential);
        } catch (error) {
            showMessage("Could not sign in as a guest. Please try again.", true);
        } finally {
            showLoading(false);
        }
    });
}
