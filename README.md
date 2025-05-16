
# Event Abstract Submission and Management Platform

# Firebase Studio

## Project Title

This is a Next.js project designed as a starter within Firebase Studio. Its primary focus is on managing abstract submissions for an event, including features for submission, refinement, and administration.

## Description
This platform is a web application designed to streamline the process of abstract submission and management for conferences or events. It provides a user-friendly interface for submitting abstracts, a powerful tool for refining submissions (likely leveraging AI), and a dedicated administrative panel for reviewing, managing, and shortlisting abstracts.
This project provides a web application for users to submit abstracts for a conference or event. It includes a form for abstract submission, a tool for refining submitted abstracts (likely using AI, as indicated by `src/ai`), and an administrative interface for managing and viewing submissions. Key components include pages for gallery view, guidelines, abstract refinement, shortlisting information, and abstract submission. The application utilizes various UI components for a polished user experience.

## Technologies Used

- Next.js (React framework)
- TypeScript
- Tailwind CSS (for styling, indicated by `tailwind.config.ts` and `src/app/globals.css`)
- SQLite (used for backend/database in API routes, see `src/app/api/submit-abstract/route.ts`)
- Genkit (AI framework, indicated by `src/ai/genkit.ts` and `src/ai/flows/abstract-refinement.ts`)
- Shadcn UI (or a similar UI component library, indicated by the numerous components in `src/components/ui`)
- `better-sqlite3` (for SQLite database interaction)

## Installation Instructions

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/EcoInvent.git 
    cd EcoInvent
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Copy `.env.example` to `.env.local`:
    ```sh
    cp .env.example .env.local
    ```
    Then, open `.env.local` and fill in your values for:
    - `GOOGLE_API_KEY`: Your Google AI Studio API key for Genkit features.
    - `NEXT_PUBLIC_ADMIN_EMAIL`: The email address for the admin login.
    - `NEXT_PUBLIC_ADMIN_PASSWORD`: The password for the admin login.

4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000) (or the port specified in your `dev` script, e.g., 9002).

## Project Structure

- `src/app` – Main Next.js app directory (pages, layouts, API routes, etc.)
- `src/components` – Reusable UI components
- `src/ai` – AI and Genkit flows for abstract refinement
- `src/lib` – Utility functions
- `src/config` – Configuration files
- `db/` – Directory where the SQLite database file (`ecoinvent.db`) will be stored (ensure write permissions for the Node.js process). This directory is in `.gitignore`.

## Usage

- **Submit Abstracts:** Users can submit abstracts through a dedicated form. Submissions are stored in an SQLite database.
- **Refine Abstracts:** Use AI-powered tools to improve submissions.
- **Admin Panel:** Access `/admin/login` to log in (credentials set via `.env.local`). View and manage submissions at `/admin/submissions`.
- **Gallery & Guidelines:** View submitted abstracts and submission guidelines.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.
