// hub.sazi.life.v2/assets/js/modules.js

// Note: This script assumes it is being loaded from a page inside the /modules/ directory.
// It is the central engine for all authenticated pages.

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Intelligently loads an HTML component into a placeholder.
 * It determines the correct relative path to the /components/ folder based on the current page's URL.
 * @param {string} componentName - The name of the component file (e.g., 'header', 'sidebar').
 * @param {string} placeholderId - The ID of the placeholder element in the HTML.
 */
const loadComponent = async (componentName, placeholderId) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Component placeholder '${placeholderId}' not found on this page.`);
        return;
    }

    // Determine the correct base path to the root of the project.
    // This logic checks if the current page is in a subdirectory of /modules/
    // (e.g., /modules/finhelp/index.html) or at the top level (/modules/index-modules.html).
    const pathSegments = window.location.pathname.split('/');
    const modulesIndex = pathSegments.indexOf('modules');
    
    // Default path for pages directly inside /modules/ (e.g., index-modules.html)
    let basePath = '../'; 

    // If the page is deeper than /modules/ (e.g., /modules/finhelp/), adjust the path
    if (modulesIndex !== -1 && pathSegments.length > modulesIndex + 2) {
        const depth = pathSegments.length - (modulesIndex + 2);
        basePath = '../'.repeat(depth + 1);
    }
    
    const componentUrl = `${basePath}components/${componentName}.html`;
    console.log(`Attempting to load component from: ${componentUrl}`);

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.text();
        placeholder.innerHTML = data;
    } catch (error) {
        console.error(`Failed to load component '${componentName}':`, error);
        placeholder.innerHTML = `<div class="p-4 text-center text-red-500">Error loading ${componentName}.</div>`;
    }
};

/**
 * Fetches user data from Firestore and populates the UI.
 * @param {object} user - The Firebase authenticated user object.
 */
const populateUserData = async (user) => {
    const displayNameEl = document.getElementById('user-display-name');
    
    if (!displayNameEl) return;

    // Use the display name from the auth object first.
    if (user.displayName) {
        displayNameEl.textContent = user.displayName;
        return;
    }

    // If the user is anonymous, give them a default name.
    if (user.isAnonymous) {
        displayNameEl.textContent = 'Guest User';
        return;
    }

    // As a fallback, try to get the name from the Firestore 'users' collection.
    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().name) {
            displayNameEl.textContent = userDoc.data().name;
        } else {
            // If all else fails, use the email.
            displayNameEl.textContent = user.email;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        displayNameEl.textContent = "User"; // Generic fallback
    }
};

/**
 * Initializes all necessary event listeners for the loaded components.
 */
const initializeEventListeners = () => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const logoutBtn = document.getElementById('logout-btn');

    // Toggle user dropdown menu
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the body click from closing it immediately
            userMenu.classList.toggle('hidden');
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Logout Error:', error));
        });
    }
    
    // Close dropdown when clicking anywhere else on the page
    document.body.addEventListener('click', () => {
        if (userMenu && !userMenu.classList.contains('hidden')) {
            userMenu.classList.add('hidden');
        }
    });

    // Make sure sidebar links are correct relative to the root
    const sidebarLinks = document.querySelectorAll('#sidebar-placeholder a');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('/')) {
            // This is a simple fix assuming all module links are from the root
            link.setAttribute('href', `/${href}`);
        }
    });
};

// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is authenticated. Loading dashboard components.");
            
            // Load all shared components in parallel
            await Promise.all([
                loadComponent('header', 'header-placeholder'),
                loadComponent('sidebar', 'sidebar-placeholder'),
                loadComponent('footer', 'footer-placeholder')
            ]);
            
            // Once components are loaded, populate user data and set up interactions
            await populateUserData(user);
            initializeEventListeners();

        } else {
            console.log("User is not authenticated. Redirecting to login page.");
            // Redirect to the login page at the root of the site.
            window.location.href = '/login.html';
        }
    });
});
