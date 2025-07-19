// hub.sazi.life.v2/assets/js/auth.js

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

let isSignUp = false;

// --- UI Control Functions ---
const showMessage = (message, isError = false) => {
    if (!messageArea) return;
    messageArea.textContent = message;
    // Use different colors for different message types
    let bgColor = isError ? 'bg-red-100' : 'bg-blue-100';
    let textColor = isError ? 'text-red-700' : 'text-blue-700';
    messageArea.className = `text-center p-3 my-4 rounded-md text-sm ${bgColor} ${textColor}`;
};

const setButtonsDisabled = (disabled) => {
    if (submitButton) submitButton.disabled = disabled;
    if (googleBtn) googleBtn.disabled = disabled;
    if (anonBtn) anonBtn.disabled = disabled;

    if (disabled) {
        submitButton?.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        submitButton?.classList.remove('opacity-50', 'cursor-not-allowed');
    }
};

// --- Core Auth Logic ---
const handleAuthSuccess = async (userCredential) => {
    const user = userCredential.user;
    if (user.metadata.creationTime === user.metadata.lastSignInTime || isSignUp) {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName || document.getElementById('name')?.value || 'Guest User',
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
    if (authForm) authForm.reset();
    if (messageArea) messageArea.innerHTML = '';
    
    if (formTitle) formTitle.textContent = isSignUp ? 'Create an Account' : 'Login to Your Digital Homestead';
    if (submitButton) submitButton.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    if (formToggleLink) formToggleLink.textContent = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
    
    nameContainer?.classList.toggle('hidden', !isSignUp);
    confirmPasswordContainer?.classList.toggle('hidden', !isSignUp);
};

// --- Event Listeners ---
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage("Authenticating, please wait...", false); // Text feedback
        setButtonsDisabled(true);
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            if (isSignUp) {
                const name = document.getElementById('name').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                if (password !== confirmPassword) throw new Error("Passwords do not match.");
                if (!name) throw new Error("Please enter your full name.");
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                await handleAuthSuccess(userCredential);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await handleAuthSuccess(userCredential);
            }
        } catch (error) {
            let friendlyMessage = error.message;
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-credential': friendlyMessage = "Invalid email or password. Please try again."; break;
                    case 'auth/email-already-in-use': friendlyMessage = "An account with this email already exists. Please sign in."; break;
                    case 'auth/weak-password': friendlyMessage = "Password must be at least 6 characters long."; break;
                }
            }
            showMessage(friendlyMessage, true);
            setButtonsDisabled(false);
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
    showMessage("Connecting to provider...", false); // Text feedback
    setButtonsDisabled(true);
    try {
        const result = await signInWithPopup(auth, provider);
        await handleAuthSuccess(result);
    } catch (error) {
        showMessage("Could not sign in. Please try again.", true);
        console.error("Social Sign-In Error:", error);
        setButtonsDisabled(false);
    }
};

if (googleBtn) {
    googleBtn.addEventListener('click', () => socialSignIn(new GoogleAuthProvider()));
}

if (anonBtn) {
    anonBtn.addEventListener('click', async () => {
        showMessage("Signing in as guest...", false); // Text feedback
        setButtonsDisabled(true);
        try {
            const userCredential = await signInAnonymously(auth);
            await handleAuthSuccess(userCredential);
        } catch (error) {
            showMessage("Could not sign in as a guest. Please try again.", true);
            setButtonsDisabled(false);
        }
    });
}
