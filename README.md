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
- SQLite (used for backend/database)
- Genkit (AI framework, indicated by `src/ai/genkit.ts` and `src/ai/flows/abstract-refinement.ts`)
- Shadcn UI (or a similar UI component library, indicated by the numerous components in `src/components/ui`)

## Installation Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/EcoInvent.git
   cd EcoInvent
   ```
2. **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in your SQLite and any required API keys.

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app` – Main Next.js app directory (pages, layouts, etc.)
- `src/components` – Reusable UI components
- `src/ai` – AI and Genkit flows for abstract refinement
- `src/lib` – Utility functions and SQLite logic
- `src/config` – Configuration files

## Usage

- **Submit Abstracts:** Users can submit abstracts through a dedicated form.
- **Refine Abstracts:** Use AI-powered tools to improve submissions.
- **Admin Panel:** Organizers can review, manage, and shortlist abstracts.
- **Gallery & Guidelines:** View submitted abstracts and submission guidelines.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is licensed under the MIT License.
