// hub.sazi.life.v2/assets/js/main.js

document.addEventListener("DOMContentLoaded", function() {

    /**
     * A general-purpose function to load HTML components.
     * It will be used on other public pages like about.html or contact.html if needed.
     * @param {string} componentPath - The path to the component's HTML file.
     * @param {string} placeholderId - The ID of the element to inject the HTML into.
     */
    const loadComponent = (componentPath, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            return; // Exit quietly if the placeholder isn't on the page
        }

        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load component: ${componentPath}`);
                }
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading component:', error);
                placeholder.innerHTML = `<div class="text-red-500 text-xs text-center">Error: ${error.message}</div>`;
            });
    };

    // Example for future use:
    // loadComponent('components/public-header.html', 'header-placeholder');

    console.log("Main public script loaded.");

});
