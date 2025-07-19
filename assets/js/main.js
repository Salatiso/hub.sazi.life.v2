// hub.sazi.life.v2/assets/js/main.js

document.addEventListener("DOMContentLoaded", function() {

    /**
     * Fetches an HTML component and loads it into a specified placeholder.
     * It now checks if the placeholder exists before fetching, preventing errors.
     * @param {string} componentPath - The path to the component's HTML file.
     * @param {string} placeholderId - The ID of the element to inject the HTML into.
     */
    const loadComponent = (componentPath, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            // This is now expected on pages that don't have this placeholder.
            // console.log(`Placeholder '${placeholderId}' not found on this page. Skipping component load.`);
            return;
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
            .catch(error => console.error('Error loading component:', error));
    };

    // --- Component Loading ---
    // These will now only run if their respective placeholders are on the current page.
    loadComponent('components/assessment.html', 'assessment-placeholder');
    // Add future public components here, e.g., loadComponent('components/theme-switcher.html', 'switchers-placeholder');


    // --- Tab Switching Logic for the Login Page ---
    const tabsContainer = document.getElementById('auth-assessment-tabs');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tab}-tab-content`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Add simple styling for tabs if it doesn't exist
        if (!document.getElementById('dynamic-tab-styles')) {
            const style = document.createElement('style');
            style.id = 'dynamic-tab-styles';
            style.textContent = `
                .tab-btn {
                    border-bottom: 2px solid transparent;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    color: #6B7280; /* gray-500 */
                }
                .tab-btn.active {
                    border-bottom-color: #3B82F6; /* blue-500 */
                    color: #1F2937; /* gray-800 */
                    font-weight: 600;
                }
                .tab-content { display: none; }
                .tab-content.active { display: block; }
            `;
            document.head.appendChild(style);
        }
    }
});
