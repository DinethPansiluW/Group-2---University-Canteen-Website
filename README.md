# 🍽️ University Canteen Website

**Group 02 | CSC1153 – Laboratory Assignment: Collaborative Website Development Using Git and GitHub**

A simple, multi-page website for the university canteen that displays canteen information, food menus and prices. It is built with **HTML, CSS and JavaScript only**, with no frameworks, no backend and no image files. The project was developed collaboratively by a group of five students using Git and GitHub (feature branches, Pull Requests, reviews and merges).

---

## 📖 Table of Contents

- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages](#-pages)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Team Members and Responsibilities](#-team-members-and-responsibilities)
- [Git and GitHub Workflow](#-git-and-github-workflow)
- [Merge Conflict Activity](#-merge-conflict-activity)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [License](#-license)

---

## 🎯 Project Objectives

**Website objectives**
- Provide students and staff with clear canteen information (location, opening hours, contact details).
- Display food menus by category along with prices.
- Offer a clean, consistent and easy-to-navigate interface.

**Learning objectives (Git and GitHub)**
- Create and manage a GitHub repository and add collaborators.
- Clone the repository and work on separate feature branches.
- Make commits and push changes to GitHub.
- Create, review and merge Pull Requests.
- Identify and resolve merge conflicts.

---

## ✨ Features

- 🧭 Navigation menu shared across all pages
- 📋 Menu page with categories (Breakfast, Lunch, Snacks, Beverages) and prices
- 🔎 JavaScript-powered menu filtering and search
- 🕒 Canteen opening hours and general information
- 📨 Contact form with JavaScript validation
- 🎨 Consistent styling through a shared stylesheet
- 🦶 Footer on every page
- 🚫 No images: visuals are made with CSS (colours, borders, gradients) and text/emoji

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5      | Page structure and content |
| CSS3       | Styling, layout (Flexbox/Grid) and responsiveness |
| JavaScript | Menu filtering/search, form validation, mobile nav toggle |
| Git        | Version control |
| GitHub     | Collaboration, Pull Requests and code review |

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Welcome section, highlights and quick links |
| About | `html/about.html` | Canteen information, opening hours, location and services |
| Menu | `html/menu.html` | Food items and prices with category filter and search |
| Contact | `html/contact.html` | Contact details and feedback/enquiry form |

> Page names may be adjusted by the group. Additional pages are welcome.

---

## 📂 Project Structure

```
university-canteen-group02/
├── .git/
├── assets/            # Non-image resources (e.g. fonts, documents)
├── css/
│   └── style.css      # Shared stylesheet
├── html/
│   ├── about.html
│   ├── menu.html
│   └── contact.html
├── js/
│   ├── main.js        # Shared scripts (nav toggle, etc.)
│   ├── menu.js        # Menu filter and search
│   └── contact.js     # Form validation
├── index.html         # Home page
└── README.md
```

---

## 🚀 Getting Started

No installation or build step is required.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd university-canteen-group02
   ```

2. **Open the website**
   - Double-click `index.html`, **or**
   - In VS Code, right-click `index.html` and choose **Open with Live Server** (recommended).

---

## 👥 Team Members and Responsibilities

| Student | Role | Name | SC Number | Responsibility | Branch |
|---------|------|------|-----------|----------------|--------|
| Student 1 | Team Leader | _Your Name_ | SC/XXXX/XXXXX | Repository management, coordination, Pull Request review and merging | `main` (reviews all PRs) |
| Student 2 | Member | _Your Name_ | SC/XXXX/XXXXX | Home page (`index.html`) | `feature/home` |
| Student 3 | Member | _Your Name_ | SC/XXXX/XXXXX | About / Information page (`html/about.html`) | `feature/about` |
| Student 4 | Member | _Your Name_ | SC/XXXX/XXXXX | Menu / Services page (`html/menu.html`, `js/menu.js`) | `feature/services` |
| Student 5 | Member | _Your Name_ | SC/XXXX/XXXXX | Contact page (`html/contact.html`, `js/contact.js`) | `feature/contact` |

The Team Leader may also contribute to development.

---

## 🔀 Git and GitHub Workflow

1. **Create repository** (Team Leader), named `university-canteen-group02`.
2. **Add collaborators**: the Team Leader invites the other four members, who accept the invitation.
3. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd university-canteen-group02
   git branch
   ```
4. **Create a feature branch** (each member runs only their own command)
   ```bash
   git switch -c feature/home
   git switch -c feature/about
   git switch -c feature/services
   git switch -c feature/contact
   ```
5. **Develop** the assigned page using HTML, CSS and JavaScript.
6. **Commit and push**
   ```bash
   git status
   git add .
   git commit -m "Add home page"
   git push -u origin feature/home
   ```
7. **Create a Pull Request** from your feature branch to `main` with a clear title and short description.
8. **Review and merge**: the Team Leader reviews each Pull Request and merges approved work into `main`.
9. **Update local repository**
   ```bash
   git switch main
   git pull origin main
   ```
10. **Verify** that all members' contributions are present.

---

## ⚔️ Merge Conflict Activity

To practise conflict resolution, two members edit the **same line** of a common file (e.g. the footer text in `css/style.css` or `index.html`) in two different branches. After merging the first branch, the second Pull Request shows a conflict, which is resolved as follows:

1. Open the conflicted file in VS Code.
2. Resolve using the **Merge Editor** (Accept Current / Incoming / Both) or edit manually, removing the `<<<<<<<`, `=======` and `>>>>>>>` markers.
3. Complete the merge:
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   git push
   ```

---

## 📝 Commit Message Guidelines

Use short, clear, present-tense messages:

```
Add home page
Add navigation menu and footer
Style menu cards with CSS
Add menu search and filter script
Fix broken link on contact page
Resolve merge conflict
```

---

## 📄 License

This project was created for educational purposes as part of the **CSC1153** laboratory assignments.
