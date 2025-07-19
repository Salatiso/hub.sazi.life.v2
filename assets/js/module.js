// hub.sazi.life.v2/assets/js/module.js

// Note: This script is the central engine for all authenticated pages.

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Loads an HTML component into a placeholder, calculating the correct relative path.
 * @param {string} componentName - The name of the component file (e.g., 'header').
 * @param {string} placeholderId - The ID of the placeholder element.
 */
const loadComponent = async (componentName, placeholderId) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Component placeholder '${placeholderId}' not found on this page.`);
        return;
    }

    const path = window.location.pathname;
    const modulesIndex = path.indexOf('/modules/');
    if (modulesIndex === -1) {
        console.error("This script is not in /modules/. Cannot determine path.");
        placeholder.innerHTML = `<div class="p-4 text-red-500">Error: Script path issue.</div>`;
        return;
    }
    const pathAfterModules = path.substring(modulesIndex + '/modules/'.length);
    const depth = (pathAfterModules.match(/\//g) || []).length;
    const basePath = '../'.repeat(depth + 1);
    const componentUrl = `${basePath}components/${componentName}.html`;

    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok for ${componentUrl}`);
        }
        const data = await response.text();
        placeholder.innerHTML = data;
    } catch (error) {
        console.error(`Failed to load component '${componentName}':`, error);
        placeholder.innerHTML = `<div class="p-4 text-red-500">Error loading ${componentName}.</div>`;
    }
};

/**
 * Populates the UI with user data from Firestore.
 * @param {object} user - The Firebase authenticated user object.
 */
const populateUserData = async (user) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for header to load
    const displayNameEl = document.getElementById('user-display-name');
    if (!displayNameEl) return;

    if (user.displayName) {
        displayNameEl.textContent = user.displayName;
    } else if (user.isAnonymous) {
        displayNameEl.textContent = 'Guest User';
    } else {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            displayNameEl.textContent = (userDoc.exists() && userDoc.data().name) ? userDoc.data().name : (user.email || "User");
        } catch (error) {
            console.error("Error fetching user data:", error);
            displayNameEl.textContent = "User";
        }
    }
};

/**
 * NEW: Fixes root-relative links to work correctly in a subdirectory (like on GitHub Pages).
 * It prepends the repository name to the path.
 * e.g., /modules/profile.html -> /hub.salatiso.com/modules/profile.html
 */
const fixAllLinks = () => {
    const path = window.location.pathname;
    // The base path is the part of the URL before '/modules/'.
    const modulesIndex = path.indexOf('/modules/');
    
    // If not found, or if it's at the root, no fixing is needed.
    if (modulesIndex <= 0) {
        console.log("Running at root. No link fixing needed.");
        return;
    }
    
    const repoBasePath = path.substring(0, modulesIndex);
    console.log(`Fixing links with base path: ${repoBasePath}`);

    // Select all links in the document.
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if it's a root-relative link (starts with /) that needs fixing.
        if (href && href.startsWith('/') && !href.startsWith('//')) {
            // Check if it's already been fixed to prevent double-prepending.
            if (!href.startsWith(repoBasePath)) {
                const newHref = repoBasePath + href;
                console.log(`Correcting link: ${href} -> ${newHref}`);
                link.setAttribute('href', newHref);
            }
        }
    });
};

/**
 * Initializes all necessary event listeners and performs post-load adjustments.
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

    // Run the link fixer after components are on the page.
    fixAllLinks();
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
            // This needs to be a root-relative path to work from any page depth.
            // The link fixer will correct this redirect if needed.
            let loginUrl = '/login.html';
            const path = window.location.pathname;
            const modulesIndex = path.indexOf('/modules/');
            if (modulesIndex > 0) {
                const repoBasePath = path.substring(0, modulesIndex);
                loginUrl = repoBasePath + loginUrl;
            }
            window.location.href = loginUrl;
        }
    });
});
