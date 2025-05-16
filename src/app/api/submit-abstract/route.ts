
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

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

export async function POST(request: NextRequest) {
  try {
    const jsonData = await request.json();

    // Validate the incoming data against the schema
    const validationResult = submissionFormSchema.safeParse(jsonData);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid submission data.', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const submissionData = validationResult.data;

    // --- BEGIN PLACEHOLDER FOR SQLITE INTEGRATION ---
    // At this point, 'submissionData' contains the validated form data.
    // You need to implement the logic to save this data to your SQLite database.
    //
    // Example steps:
    // 1. Connect to your SQLite database.
    // 2. Prepare SQL statements to insert into 'Submissions' and 'TeamMembers' tables.
    //    (Refer to the database schema discussed previously).
    // 3. Execute the SQL statements.
    //    - For 'team' participation, first insert into 'Submissions' to get the submissionId.
    //    - Then, if there are team members, insert them into 'TeamMembers' using that submissionId.
    // 4. Handle any potential database errors.

    console.log('Received Submission Data (Placeholder - Save to SQLite here):', submissionData);

    // Simulating a successful database operation
    const isSuccess = true; // Replace with actual database operation success status

    if (isSuccess) {
      return NextResponse.json({ message: 'Submission received successfully!' }, { status: 200 });
    } else {
      // This part would be reached if your database operation fails
      return NextResponse.json({ message: 'Failed to save submission to the database.' }, { status: 500 });
    }
    // --- END PLACEHOLDER FOR SQLITE INTEGRATION ---

  } catch (error) {
    console.error('Error processing submission:', error);
    // Differentiate between ZodError and other errors if needed, though safeParse handles Zod errors.
    if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Invalid submission data.', errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}

    