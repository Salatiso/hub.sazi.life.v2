// hub.sazi.life/assets/js/main.js

document.addEventListener("DOMContentLoaded", function() {

    /**
     * Fetches HTML content from a file and injects it into a placeholder element.
     * @param {string} componentPath - The path to the HTML component file.
     * @param {string} placeholderId - The ID of the element to inject the content into.
     */
    const loadComponent = (componentPath, placeholderId) => {
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load component: ${componentPath}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                } else {
                    console.error(`Placeholder with ID '${placeholderId}' not found.`);
                }
            })
            .catch(error => console.error('Error loading component:', error));
    };

    /**
     * Loads all the page components into their respective placeholders.
     */
    const loadAllComponents = () => {
        loadComponent('components/header.html', 'header-placeholder');
        loadComponent('components/sidebar-tools.html', 'sidebar-tools-placeholder');
        loadComponent('components/main-landing.html', 'main-landing-placeholder');
        loadComponent('components/sidebar-milestones.html', 'sidebar-milestones-placeholder');
    };

    /**
     * Sets up the infinitely scrolling sidebar by cloning its items.
     * This needs to be run after the component is loaded.
     * @param {string} listId - The ID of the list element to set up for scrolling.
     */
    const setupScrollingSidebar = (listId) => {
        const listElement = document.getElementById(listId);
        if (!listElement || listElement.children.length === 0) return;

        // Clone items to create a seamless loop
        const originalItems = Array.from(listElement.children);
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            listElement.appendChild(clone);
        });
    };

    // Use a MutationObserver to wait for the sidebar to be loaded before setting up the scroll.
    // This is more reliable than a simple timer.
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const milestonesList = document.getElementById('ohs-milestones-list');
                if (milestonesList) {
                    setupScrollingSidebar('ohs-milestones-list');
                    observer.disconnect(); // Stop observing once the element is found and set up
                    return;
                }
            }
        }
    });

    // Start observing the placeholder for the milestones sidebar.
    const milestonesPlaceholder = document.getElementById('sidebar-milestones-placeholder');
    if (milestonesPlaceholder) {
        observer.observe(milestonesPlaceholder, { childList: true, subtree: true });
    }

    // Load all components when the DOM is ready.
    loadAllComponents();
});

/**
 * Initializes the Google Translate element.
 * This function is called by the Google Translate script once it has loaded.
 */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,af,zu,xh,nso,st,tn,ts,ve,ss,sn,sw,pt,fr,es,zh-CN',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}
