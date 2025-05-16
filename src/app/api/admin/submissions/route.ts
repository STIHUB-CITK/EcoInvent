
import { NextResponse, type NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define the path to the database file
const dbDir = path.join(process.cwd(), 'db');
const dbPath = path.join(dbDir, 'ecoinvent.db');

interface ConnectDbResult {
  db: Database.Database | null;
  dbNotFound: boolean;
}

function connectDb(): ConnectDbResult {
  if (!fs.existsSync(dbDir)) {
    console.warn(`Database directory ${dbDir} does not exist. Admin panel will show no data as the directory is missing.`);
    return { db: null, dbNotFound: true };
  }
  if (!fs.existsSync(dbPath)) {
    console.warn(`Database file ${dbPath} does not exist. Admin panel will show no data as the file is missing.`);
    return { db: null, dbNotFound: true };
  }
  try {
    const instance = new Database(dbPath, { readonly: true });
    // console.log('Connected to SQLite database for reading submissions at', dbPath);
    return { db: instance, dbNotFound: false };
  } catch (error) {
    console.error('Failed to connect to SQLite database for reading:', error);
    return { db: null, dbNotFound: false }; // dbNotFound is false because it's a connection error, not a file not found error.
  }
}

export async function GET(request: NextRequest) {
  const { db: currentDb, dbNotFound } = connectDb();

  if (dbNotFound) {
    // If the DB file/dir specifically wasn't found, it's likely not initialized yet.
    // Return empty submissions, which is a valid state for the frontend to handle.
    return NextResponse.json({ submissions: [] }, { status: 200 });
  }

  if (!currentDb) {
    // This implies a connection error other than the file not being found (e.g., corrupted file, permissions).
    return NextResponse.json({ message: 'Database connection failed.' }, { status: 500 });
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
      currentDb.close();
      // console.log('Database connection closed for reading submissions.');
    }
  }
}
