\# The Hub by Salatiso: Master Technical Specification  
\*\*Document ID:\*\* ARCH-SPEC-V3.0    
\*\*Date:\*\* 2025-07-19    
\*\*Status:\*\* Adopted & As-Built

\---

\#\#\# \*\*Part 1: Vision & Official Branding\*\*

This document serves as the definitive technical and architectural blueprint for the Salatiso ecosystem, centered around its core integration point, \*\*The Hub\*\*.

\* \*\*Master Brand:\*\* \*\*Salatiso\*\*  
    \* The parent brand representing the philosophy of empowerment that underpins the entire ecosystem.  
\* \*\*Ecosystem Name & Slogan:\*\* \*\*The Hub by Salatiso: Your digital homestead.\*\*  
    \* This is the official name for the central user dashboard. It is the single point of entry and integration for all platforms.  
\* \*\*Branding Implementation:\*\*  
    \* The full branding block (The Hub title, Salatiso SVG logo, "by Salatiso" text, and the official slogan) will be prominently and exclusively displayed at the top of the main sidebar within the authenticated user dashboard. This reinforces the user's location within their central homestead.

\---

\#\#\# \*\*Part 2: Master File Repository Structure\*\*

This is the audited, as-built file structure for \`hub.sazi.life.v2\`. It is the standard for the project.

/hub.sazi.life.v2/  
|  
├── index.html // Public landing & login page.  
├── about.html // Public informational page.  
├── contact.html // Public contact page.  
├── assessment.html // Public "Find Your Tool" wizard page.  
├── quiz.html // Authenticated "Holistic Quiz" page.  
|  
├── /modules/ // Authenticated user-facing application pages.  
│ ├── index-modules.html // Authenticated main dashboard view after login.  
│ ├── profile.html // User profile page.  
│ │  
│ └── /finhelp/ // Example module folder.  
│ └── index.html  
|  
├── /components/ // Reusable HTML partials.  
│ ├── header.html  
│ ├── footer.html  
│ ├── sidebar.html // Main sidebar for the authenticated dashboard.  
│ └── ...  
|  
├── /assets/  
│ ├── /css/  
│ │ ├── style.css // Global styles for all pages.  
│ │ ├── login.css // Styles specific to index.html.  
│ │ ├── modules.css // Layout styles for the authenticated dashboard.  
│ │ └── quiz.css // Styles for the quiz page.  
│ │  
│ ├── /js/  
│ │ ├── main.js // Public Engine: For public pages ONLY (index, about, contact).  
│ │ ├── modules.js // Authenticated Engine: Protects and builds all pages in /modules/.  
│ │ ├── auth.js // Handles all Firebase authentication logic on index.html.  
│ │ ├── firebase-config.js  
│ │ ├── assessment.js // Powers the assessment.html wizard.  
│ │ ├── quiz.js // Powers the quiz.html experience.  
│ │ └── quiz-database.js // Contains all questions for the quiz.  
│ │  
│ └── /images/  
|  
└── /documents/ // Project planning and specification documents.  
\---

\#\#\# \*\*Part 3: Phased Technical Specification (Ecosystem Standard)\*\*

This defines the development standard for any website within the ecosystem.

\#\#\#\# \*\*Level 1: Basic Static Website\*\*  
\* \*\*Philosophy:\*\* A professional, fast, and reliable public-facing "digital business card."  
\* \*\*Technology:\*\* HTML5, CSS3, Vanilla JavaScript (ES6), Tailwind CSS.  
\* \*\*Architecture:\*\* Reusable HTML partials in \`/components/\` are loaded by \`assets/js/main.js\` as needed.  
\* \*\*Characteristics:\*\* No backend, no user authentication, extremely fast.

\#\#\#\# \*\*Level 2: Hybrid Static & Dynamic Website (The Hub Standard)\*\*  
\* \*\*Philosophy:\*\* An authenticated web application with a static public front-end. This is the current, active model for \`hub.sazi.life.v2\`.  
\* \*\*Technology Stack:\*\* All technologies from Level 1, plus Firebase (Firestore, Authentication, Hosting).  
\* \*\*Architecture & User Flow:\*\*  
    1\.  \*\*Public Entry:\*\* The user interacts with a suite of public-facing pages in the root directory (\`index.html\`, \`about.html\`, \`assessment.html\`). The \`index.html\` file serves as the primary gateway for authentication.  
    2\.  \*\*Authentication:\*\* The \`assets/js/auth.js\` script handles all sign-up and sign-in logic on \`index.html\`.  
    3\.  \*\*Redirection:\*\* Upon successful authentication, the user is redirected to \`index-modules.html\`.  
    4\.  \*\*Authenticated Environment:\*\* The \`assets/js/modules.js\` script runs on \`index-modules.html\` and all pages within the \`/modules/\` directory. It acts as a gatekeeper, verifying the user's session. If the user is authenticated, it builds the page by loading the header, the newly branded sidebar, and the footer. If the user is not authenticated, it immediately redirects them back to \`index.html\`.

\#\#\#\# \*\*Level 3: Full Dynamic Application (Future Goal)\*\*  
\* \*\*Philosophy:\*\* A seamless, app-like user experience for highly complex and interactive platforms.  
\* \*\*Technology Stack:\*\* React or Vue.js, Firebase (Firestore, Auth, Cloud Functions).  
\* \*\*Architecture:\*\* A Single Page Application (SPA) where the UI is managed entirely by the JavaScript framework.  
\* \*\*Key Characteristics:\*\* Fluid UX with no page reloads, highly scalable, requires a build step.  
