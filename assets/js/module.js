// hub.sazi.life.v2/assets/js/modules.js

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Loads an HTML component into a placeholder element on the page.
 * @param {string} componentName - The name of the component file (e.g., 'header').
 * @param {string} placeholderId - The ID of the placeholder element.
 */
const loadComponent = async (componentName, placeholderId) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Placeholder '${placeholderId}' not found on this page.`);
        return;
    }
    try {
        // Use a root-relative path to ensure it works from any page depth
        const response = await fetch(`/components/${componentName}.html`);
        if (!response.ok) throw new Error(`Failed to load ${componentName}. Status: ${response.status}`);
        placeholder.innerHTML = await response.text();
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
        placeholder.innerHTML = `<p class="text-red-500 p-4">Error: Could not load ${componentName}.</p>`;
    }
};

/**
 * Populates the user-specific elements in the header.
 * @param {object} user - The Firebase user object.
 */
const populateUserData = async (user) => {
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        // Try to get display name from Auth first, then Firestore as a fallback
        if (user.displayName) {
            userDisplayName.textContent = user.displayName;
        } else {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().displayName) {
                userDisplayName.textContent = userDoc.data().displayName;
            } else {
                userDisplayName.textContent = "User"; // Fallback
            }
        }
    }
};

/**
 * Initializes all event listeners for the loaded components.
 */
const initializeEventListeners = () => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const logoutBtn = document.getElementById('logout-btn');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling up to the body
            userMenu.classList.toggle('hidden');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Logout Error:', error));
        });
    }
    
    // Close dropdown when clicking anywhere else on the page
    document.body.addEventListener('click', () => {
        userMenu?.classList.add('hidden');
    });
};

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in. Proceed to build the authenticated page.
            console.log("User is authenticated. Loading dashboard components.");

            // Load all shared components in parallel for speed
            await Promise.all([
                loadComponent('header', 'header-placeholder'),
                loadComponent('sidebar', 'sidebar-placeholder'),
                // loadComponent('footer', 'footer-placeholder') // Can be added later
            ]);

            // Once components are loaded, populate user data and set up interactions
            await populateUserData(user);
            initializeEventListeners();

        } else {
            // User is signed out. Redirect them to the login page.
            console.log("User is not authenticated. Redirecting to login page.");
            // Protect the page by redirecting
            // Check if we are already on the root/index page to avoid a redirect loop
            if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
                 window.location.href = '/index.html';
            }
        }
    });
});
