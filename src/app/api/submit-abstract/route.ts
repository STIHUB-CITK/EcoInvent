
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define the schema for team members, matching the frontend
const teamMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// Define the main submission schema, matching the frontend
const submissionFormSchema = z.object({
  participationType: z.enum(['solo', 'team']),
  contactPersonName: z.string().min(2),
  mobileNumber: z.string().min(10).max(15),
  email: z.string().email(),
  teamName: z.string().optional(),
  teamMembers: z.array(teamMemberSchema).max(3).optional(),
  concept: z.string().min(50).max(1000),
  objective: z.string().min(30).max(500),
  requirements: z.string().min(10).max(500),
  technicalApplications: z.string().min(20).max(500),
  slidesLink: z.string().url(),
});

// --- Database Setup ---
// Ensure the 'db' directory exists
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'ecoinvent.db');
let db: Database.Database | undefined;

try {
  db = new Database(dbPath); // { verbose: console.log } can be added for debugging
  console.log('Connected to SQLite database at', dbPath);

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS Submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participationType TEXT NOT NULL CHECK(participationType IN ('solo', 'team')),
        contactPersonName TEXT NOT NULL,
        mobileNumber TEXT NOT NULL,
        email TEXT NOT NULL,
        teamName TEXT,
        concept TEXT NOT NULL,
        objective TEXT NOT NULL,
        requirements TEXT NOT NULL,
        technicalApplications TEXT NOT NULL,
        slidesLink TEXT NOT NULL,
        submissionTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS TeamMembers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submissionId INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        FOREIGN KEY (submissionId) REFERENCES Submissions(id) ON DELETE CASCADE
    );
  `);
  console.log('Database tables ensured.');
} catch (error) {
  console.error('Failed to connect to or initialize SQLite database:', error);
  // If DB connection fails, we might not be able to proceed with POST requests.
  // For critical DB setup failure, you might want to prevent the API route from functioning.
}


export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ message: 'Database connection failed. Cannot process submission.' }, { status: 500 });
  }

  try {
    const jsonData = await request.json();
    const validationResult = submissionFormSchema.safeParse(jsonData);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid submission data.', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const submissionData = validationResult.data;

    // --- BEGIN SQLITE INTEGRATION ---
    const insertSubmissionStmt = db.prepare(`
      INSERT INTO Submissions (
        participationType, contactPersonName, mobileNumber, email, teamName,
        concept, objective, requirements, technicalApplications, slidesLink
      ) VALUES (
        @participationType, @contactPersonName, @mobileNumber, @email, @teamName,
        @concept, @objective, @requirements, @technicalApplications, @slidesLink
      )
    `);

    const insertTeamMemberStmt = db.prepare(`
      INSERT INTO TeamMembers (submissionId, name, email)
      VALUES (@submissionId, @name, @email)
    `);

    let submissionId;

    // Use a transaction to ensure all or no data is written
    db.transaction(() => {
      const info = insertSubmissionStmt.run({
        participationType: submissionData.participationType,
        contactPersonName: submissionData.contactPersonName,
        mobileNumber: submissionData.mobileNumber,
        email: submissionData.email,
        teamName: submissionData.teamName || null, // Ensure null if undefined
        concept: submissionData.concept,
        objective: submissionData.objective,
        requirements: submissionData.requirements,
        technicalApplications: submissionData.technicalApplications,
        slidesLink: submissionData.slidesLink,
      });

      submissionId = info.lastInsertRowid;

      if (submissionData.participationType === 'team' && submissionData.teamMembers && submissionData.teamMembers.length > 0) {
        if (!submissionId) {
          throw new Error("Failed to get submission ID for team members.");
        }
        for (const member of submissionData.teamMembers) {
          insertTeamMemberStmt.run({
            submissionId: submissionId,
            name: member.name,
            email: member.email,
          });
        }
      }
    })(); // Immediately invoke the transaction

    console.log('Submission saved to SQLite. Submission ID:', submissionId);
    return NextResponse.json({ message: 'Submission received successfully!', submissionId: submissionId }, { status: 200 });
    // --- END SQLITE INTEGRATION ---

  } catch (error) {
    console.error('Error processing submission:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid submission data.', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    // Check if it's a better-sqlite3 error
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle specific SQLite errors if needed, e.g., UNIQUE constraint failed
      return NextResponse.json({ message: `Database error: ${(error as unknown as Error).message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
  // Note: db.close() is not explicitly called here as 'better-sqlite3' connections
  // are generally kept open for the lifetime of the app or managed differently in serverless contexts.
  // For simple server setups, it might be closed on server shutdown.
  // If you open it per request, you should close it.
  // Here, we open it once when the module loads.
}
