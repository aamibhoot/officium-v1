# Officium

An application for managing office tasks.

## About

Officium is a modern, intuitive application designed to streamline office management and enhance productivity. It provides a suite of tools for task tracking, team collaboration, and resource management, all within a clean and user-friendly interface.

## Features

Based on the current project structure, the following features have been implemented:

*   **Authentication**: User registration and login system.
    *   Sign Up page (`/auth/signup`)
    *   Login page (`/auth/login`)
*   **Protected Routes**: A middleware setup to protect specific routes, ensuring only authenticated users can access them.
*   **Dashboard**: A central dashboard for authenticated users, available at `/dashboard`.
*   **User Profile**: A dedicated page for users to view their profile information (`/profile`).
*   **API Layer**: Backend authentication routes handled via Next.js API routes.
*   **Component-Based UI**: A rich set of reusable UI components built with `shadcn/ui`.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/installation) installed on your machine.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/aamibhoot/officium-app.git
   ```
2. Install NPM packages
   ```sh
   pnpm install
   ```

### Running the Development Server

Execute the following command to run the app in development mode:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker

You can also run the application using Docker.

### Build the Docker image

```bash
docker build -t officium-app .
```

### Run the Docker container

```bash
docker run -p 3000:3000 officium-app
```

## Developer

- **Name**: Aami Bhoot
- **GitHub**: [aamibhoot](https://github.com/aamibhoot)
