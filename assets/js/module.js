// hub.sazi.life.v2/assets/js/module.js

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

    // NEW, MORE ROBUST LOGIC: This correctly calculates the path depth
    // for pages inside /modules/ and its subdirectories.
    const path = window.location.pathname;
    const modulesIndex = path.indexOf('/modules/');

    if (modulesIndex === -1) {
        console.error("This script is not running from within the /modules/ directory. Cannot determine component path.");
        placeholder.innerHTML = `<div class="p-4 text-center text-red-500">Error: Script path issue.</div>`;
        return;
    }

    // Get the part of the path *after* /modules/
    const pathAfterModules = path.substring(modulesIndex + '/modules/'.length);
    
    // Count the number of slashes to determine directory depth
    const depth = (pathAfterModules.match(/\//g) || []).length;
    
    // The base path needs to go up one level for 'modules' itself, plus one for each level of depth
    const basePath = '../'.repeat(depth + 1);
    
    const componentUrl = `${basePath}components/${componentName}.html`;
    console.log(`Attempting to load component from: ${componentUrl}`);

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} for ${componentUrl}`);
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
    // Wait for a moment to ensure the header component is loaded
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    const displayNameEl = document.getElementById('user-display-name');
    if (!displayNameEl) {
        console.warn("Could not find 'user-display-name' element in the header.");
        return;
    }

    if (user.displayName) {
        displayNameEl.textContent = user.displayName;
    } else if (user.isAnonymous) {
        displayNameEl.textContent = 'Guest User';
    } else {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().name) {
                displayNameEl.textContent = userDoc.data().name;
            } else {
                displayNameEl.textContent = user.email || "User";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            displayNameEl.textContent = "User";
        }
    }
};

/**
 * Initializes all necessary event listeners for the loaded components.
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
        if (userMenu && !userMenu.classList.contains('hidden')) {
            userMenu.classList.add('hidden');
        }
    });

    const overviewLink = document.querySelector('#sidebar-placeholder a[href="/index-modules.html"]');
    if (overviewLink) {
        overviewLink.href = '/modules/index-modules.html';
    }
};

// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
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
            console.log("User is not authenticated. Redirecting to login page.");
            window.location.href = '/login.html';
        }
    });
});
