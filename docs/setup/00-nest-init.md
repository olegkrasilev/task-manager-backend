# Backend Setup — task-manager

This document contains all setup steps for initializing the backend of the `task-manager` project using NestJS, Git, and project documentation structure.

---

## 1. Install NestJS CLI

Install the NestJS CLI globally and check the version:

```bash
npm install -g @nestjs/cli
nest --version
````

---

## 2. Create NestJS Project

Create a new project using the CLI:

```bash
nest new task-manager
```

When prompted, choose a package manager (e.g. `npm`).

---

## 3. Configure Git (Local Only)

Set up your Git user information for local commits:

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## 4. Make Initial Commit

Stage all files and create the first commit:

```bash
git add .
git commit -m "initial commit"
```

