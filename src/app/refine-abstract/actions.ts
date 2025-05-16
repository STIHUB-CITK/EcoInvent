"use server";
import { refineAbstract, type AbstractRefinementInput, type AbstractRefinementOutput } from '@/ai/flows/abstract-refinement';
import { z } from 'zod';

// Re-define schema here or import if shared. For this case, it's fine to redefine for server action validation.
const ServerAbstractRefinementInputSchema = z.object({
  abstractText: z.string().min(10, "Abstract text is too short."),
  ideathonCategory: z.string().min(1, "Ideathon category is required."),
  currentEnvironmentalTrends: z.string().min(10, "Environmental trends description is too short."),
  successfulSubmissionExamples: z.string().min(10, "Submission examples are too short."),
});

export async function handleAbstractRefinement(
  data: AbstractRefinementInput
): Promise<{ success: boolean; data?: AbstractRefinementOutput; error?: string }> {
  const validationResult = ServerAbstractRefinementInputSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const result = await refineAbstract(validationResult.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error refining abstract:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to refine abstract: ${errorMessage}` };
  }
}
