\# The Hub by Salatiso: Master Technical Specification  
\*\*Document ID:\*\* ARCH-SPEC-V4.0    
\*\*Date:\*\* 2025-07-19    
\*\*Status:\*\* Adopted & As-Built

\---

\#\#\# \*\*Part 1: Vision & Official Branding\*\*

This document serves as the definitive technical and architectural blueprint for the Salatiso ecosystem, centered around its core integration point, \*\*The Hub\*\*.

\* \*\*Master Brand:\*\* \*\*Salatiso\*\*  
\* \*\*Ecosystem Name & Slogan:\*\* \*\*The Hub by Salatiso: Your digital homestead.\*\*  
\* \*\*Branding Implementation:\*\* The full branding block (The Hub title, Salatiso SVG logo, "by Salatiso" text, and the official slogan) will be prominently displayed at the top of the main sidebar within the authenticated user dashboard.

\---

\#\#\# \*\*Part 2: Master File Repository Structure\*\*

This is the audited, as-built file structure for \`hub.sazi.life.v2\`.

/hub.sazi.life.v2/  
|  
├── index.html // Public landing page.  
├── login.html // Public login/signup page.  
├── about.html // Public informational page.  
├── contact.html // Public contact page.  
├── assessment.html // Public "Find Your Tool" wizard page.  
├── quiz.html // Authenticated "Holistic Quiz" page.

│ ├──  
|  
├── /modules/ // ALL Authenticated user-facing pages.  
│ ├── index-modules.html // Authenticated main dashboard view after login.  
│ ├── profile.html // User profile page.

│ │  
│ └── /finhelp/ // Example module folder.  
│ └── index.html  
|  
├── /components/ // Reusable HTML partials.  
│ ├── header.html  
│ ├── footer.html  
│ └── sidebar.html  
|  
├── /assets/  
│ ├── /css/  
│ └── /js/  
│ ├── main.js // Public Engine: For public pages ONLY.  
│ ├── modules.js // Authenticated Engine: Protects and builds all pages in /modules/.  
│ ├── auth.js // Handles authentication logic on login.html.  
│ └── ...  
|  
└── /documents/  
\---

\#\#\# \*\*Part 3: Phased Technical Specification (Ecosystem Standard)\*\*

\#\#\#\# \*\*Level 2: Hybrid Static & Dynamic Website (The Hub Standard)\*\*  
\* \*\*Philosophy:\*\* An authenticated web application with a static public front-end.  
\* \*\*Technology Stack:\*\* HTML5, CSS3, Vanilla JavaScript, Tailwind CSS, Firebase.  
\* \*\*Architecture & User Flow:\*\*  
    1\.  \*\*Public Entry:\*\* User interacts with public pages in the root directory.  
    2\.  \*\*Authentication:\*\* The user navigates to \`login.html\`. The \`assets/js/auth.js\` script handles all sign-up and sign-in logic.  
    3\.  \*\*Redirection:\*\* Upon successful authentication, the user is redirected to \`/modules/index-modules.html\`.  
    4\.  \*\*Authenticated Environment:\*\* The \`assets/js/modules.js\` script runs on \*\*all pages\*\* within the \`/modules/\` directory. It acts as a gatekeeper, verifying the user's session and building the page with the shared components. If the user is not authenticated, it redirects them back to \`login.html\`.  
