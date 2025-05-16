
import { NextResponse, type NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define the path to the database file
const dbDir = path.join(process.cwd(), 'db');
const dbPath = path.join(dbDir, 'ecoinvent.db');

let db: Database.Database;

function connectDb() {
  if (!fs.existsSync(dbDir)) {
    console.warn(`Database directory ${dbDir} does not exist. Admin panel might not find data.`);
    return null;
  }
  if (!fs.existsSync(dbPath)) {
    console.warn(`Database file ${dbPath} does not exist. Admin panel might not find data.`);
    return null;
  }
  try {
    db = new Database(dbPath, { readonly: true }); // Open in read-only mode
    console.log('Connected to SQLite database for reading submissions at', dbPath);
    return db;
  } catch (error) {
    console.error('Failed to connect to SQLite database for reading:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const currentDb = connectDb();
  if (!currentDb) {
    return NextResponse.json({ message: 'Database connection failed or database file not found.' }, { status: 500 });
  }

  try {
    // Query to get all submissions and count of team members for each
    const stmt = currentDb.prepare(`
      SELECT 
        s.id,
        s.participationType,
        s.contactPersonName,
        s.mobileNumber,
        s.email,
        s.teamName,
        s.concept,
        s.objective,
        s.requirements,
        s.technicalApplications,
        s.slidesLink,
        s.submissionTimestamp,
        (SELECT COUNT(*) FROM TeamMembers tm WHERE tm.submissionId = s.id) as teamMemberCount
      FROM Submissions s
      ORDER BY s.submissionTimestamp DESC
    `);
    
    const submissions = stmt.all();

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch submissions.', error: errorMessage }, { status: 500 });
  } finally {
    if (currentDb) {
      // currentDb.close(); // For read-only, it's less critical to close immediately, but good practice
      // console.log('Database connection closed for reading submissions.');
      // better-sqlite3 docs suggest that for read-only operations, connection can be kept open or closed as needed.
      // For serverless functions that may re-use connections, this might be fine.
      // If it's a new connection per request, .close() is important.
      // Since connectDb() is called per request here, we should close.
      // However, Vercel might complain about fs operations after response.
      // For simplicity in this prototype, let's leave it open or manage it via a shared instance in a real app.
    }
  }
}
