# P. A. Aiswarya - Personal Portfolio Website

**Student Name:** P. A. Aiswarya  
**Roll Number:** CCE25CS202  
**Department:** Computer Science & Engineering (2nd Year)  
**Institution:** Christ College of Engineering (Autonomous), Irinjalakuda, Thrissur, Kerala  
**GitHub Pages URL:** [https://p-a-aiswarya.github.io/p.a.aiswarya-CS202/](https://p-a-aiswarya.github.io/p.a.aiswarya-CS202/)
**Live Deployment URL (Surge):** [https://pa-aiswarya-portfolio.surge.sh](https://pa-aiswarya-portfolio.surge.sh)

---

## 🛠️ Core Technology Stack

This application is built from the ground up using the following foundational web technologies and tools:

| Technology | Role & Purpose |
| :--- | :--- |
| **ReactJS** | Component-driven user interface architecture (React 19) |
| **JavaScript (ES6+)** | Core application logic, event handlers, and data structures |
| **HTML5** | Semantic markup, metadata tags, and accessible document structure |
| **JSX** | Declarative syntax for rendering dynamic components |
| **CSS3 (Vanilla CSS)** | Custom design system using CSS variables, flexbox, grid, and animations |
| **React Router (`react-router-dom`)** | Declarative client-side routing for Single Page Application (SPA) navigation |
| **NodeJS** | JavaScript runtime environment for building and running the project |
| **npm** | Package manager for managing dependencies and execution scripts |

---

## ✨ Key Project Features

1. **Academic & Skills Grounding**:
   - Honest, authentic presentation of a 2nd-year B.Tech CSE student.
   - Core interests in Data Science, Mathematics, AI tools, Machine Learning, 3D printing workshops, and hackathons.
   - Verified educational qualifications and technical skills breakdown.

2. **Certificates & Achievements Folder View**:
   - Organized category tabs: *All Documents*, *Achievements*, *Internships & Industry*, and *Workshops & Training*.
   - Interactive high-visibility *"Click to See Certificate"* action button.
   - Certificate lightbox modal with document metadata and download capability.

3. **Modern Pink UI Design System**:
   - Curated radiant Pink and Rose color scheme (`#ec4899`, `#f43f5e`, `#db2777`).
   - Seamless dark mode and light mode switching with persistent `localStorage` preference.
   - Smooth micro-interactions, responsive navigation drawer, and ambient glowing highlights.

4. **Working Contact & Enquiry System**:
   - Client-side form validation with real-time feedback.
   - Direct message delivery to `aiswaryaajay2008@gmail.com`.
   - 1-click fallback integration with WhatsApp (`+91 6282415966`) and Email clients (Gmail/Outlook).

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation & Run Steps

1. **Clone or open the project directory:**
   ```bash
   cd "P A Aiswarya-CCE25CS202"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Create a production build:**
   ```bash
   npm run build
   ```
   Generates optimized assets in the `dist/` directory including `200.html` for client-side SPA routing.

5. **Lint the codebase:**
   ```bash
   npm run lint
   ```

---

## 📁 Project Directory Structure

```text
├── index.html                   # HTML5 root document with meta tags and favicon
├── package.json                 # Project configuration, dependencies (React, React Router, Vite)
├── src/
│   ├── App.jsx                  # Main application component with React Router & theme state
│   ├── main.jsx                 # React root entry point
│   ├── index.css                # Complete Vanilla CSS design system (Pink theme, variables)
│   ├── components/
│   │   ├── Header.jsx           # Responsive navigation bar & theme toggle
│   │   ├── Footer.jsx           # Comprehensive footer with full technology stack
│   │   ├── ProjectCard.jsx      # Non-AI project showcases
│   │   ├── CertificateCard.jsx  # Certificate card with "Click to See Certificate" action
│   │   ├── CertificateModal.jsx # Full-screen certificate viewer lightbox
│   │   ├── InputField.jsx       # Reusable accessible form input component
│   │   ├── ScrollToTop.jsx      # Auto-scroll on route transition
│   │   └── SocialIcons.jsx      # SVG social media icons (GitHub, LinkedIn, WhatsApp, etc.)
│   ├── data/
│   │   └── portfolioData.js     # Structured portfolio information, certificates, and skills
│   └── pages/
│       ├── Home.jsx             # Hero section, focus tags, projects, and certificates folder
│       ├── About.jsx            # Academic qualification, skills, and industry experience
│       └── Contact.jsx          # Live contact enquiry form with WhatsApp & mailto links
└── public/
    └── images/                  # Profile photo and verified certificate images
```

---

© 2026 P. A. Aiswarya (CCE25CS202). All rights reserved.
