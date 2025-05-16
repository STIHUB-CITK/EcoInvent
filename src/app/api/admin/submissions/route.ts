
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

interface TeamMember {
  name: string;
  email: string;
}
interface SubmissionFromDb {
  id: number;
  participationType: 'solo' | 'team';
  contactPersonName: string;
  mobileNumber: string;
  email: string;
  teamName?: string | null;
  concept: string;
  objective: string;
  requirements: string;
  technicalApplications: string;
  slidesLink: string;
  submissionTimestamp: string;
  teamMembers?: TeamMember[]; // To hold fetched team members
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
    return { db: instance, dbNotFound: false };
  } catch (error) {
    console.error('Failed to connect to SQLite database for reading:', error);
    return { db: null, dbNotFound: false };
  }
}

export async function GET(request: NextRequest) {
  const { db: currentDb, dbNotFound } = connectDb();

  if (dbNotFound) {
    return NextResponse.json({ submissions: [] }, { status: 200 });
  }

  if (!currentDb) {
    return NextResponse.json({ message: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const submissionsStmt = currentDb.prepare(`
      SELECT 
        id,
        participationType,
        contactPersonName,
        mobileNumber,
        email,
        teamName,
        concept,
        objective,
        requirements,
        technicalApplications,
        slidesLink,
        submissionTimestamp
      FROM Submissions
      ORDER BY submissionTimestamp DESC
    `);

    const submissionsFromDb = submissionsStmt.all() as Omit<SubmissionFromDb, 'teamMembers' | 'teamMemberCount'>[];

    const teamMembersStmt = currentDb.prepare(`
      SELECT name, email FROM TeamMembers WHERE submissionId = ?
    `);

    const submissionsWithMembers = submissionsFromDb.map(submission => {
      let teamMembers: TeamMember[] = [];
      let teamMemberCount = 0;
      if (submission.participationType === 'team') {
        teamMembers = teamMembersStmt.all(submission.id) as TeamMember[];
        teamMemberCount = teamMembers.length;
      }
      return {
        ...submission,
        teamMembers,
        teamMemberCount // This is the count of *additional* members excluding the lead
      };
    });

    return NextResponse.json({ submissions: submissionsWithMembers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch submissions.', error: errorMessage }, { status: 500 });
  } finally {
    if (currentDb) {
      currentDb.close();
    }
  }
}
