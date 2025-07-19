// hub.sazi.life.v2/assets/js/modules.js

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Intelligently loads an HTML component into a placeholder.
 * It automatically determines the correct relative path to the components folder.
 * @param {string} componentName - The name of the component file (e.g., 'header').
 * @param {string} placeholderId - The ID of the placeholder element.
 */
const loadComponent = async (componentName, placeholderId) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Placeholder '${placeholderId}' not found on this page.`);
        return;
    }

    // Determine the correct base path. If the page is in a subfolder of /modules/, 
    // it needs to go up two levels (../../). Otherwise, just one level (../).
    const isSubdirectory = window.location.pathname.includes('/modules/') && window.location.pathname.split('/modules/')[1].includes('/');
    const basePath = isSubdirectory ? '../../' : '../';

    try {
        const response = await fetch(`${basePath}components/${componentName}.html`);
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
        if (user.displayName) {
            userDisplayName.textContent = user.displayName;
        } else {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            userDisplayName.textContent = (userDoc.exists() && userDoc.data().displayName) ? userDoc.data().displayName : "User";
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
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Logout Error:', error));
        });
    }
    
    document.body.addEventListener('click', () => {
        userMenu?.classList.add('hidden');
    });
};

// --- Main Execution ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is authenticated. Loading dashboard components.");
        await Promise.all([
            loadComponent('header', 'header-placeholder'),
            loadComponent('sidebar', 'sidebar-placeholder'),
            loadComponent('footer', 'footer-placeholder')
        ]);
        await populateUserData(user);
        initializeEventListeners();
    } else {
        console.log("User is not authenticated. Redirecting to login.");
        // Use a root-relative path for redirection to work from any depth
        window.location.href = '/login.html';
    }
});
