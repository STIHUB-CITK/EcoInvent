import type { Metadata } from 'next';
import { AbstractSubmissionForm } from '@/components/sections/AbstractSubmissionForm';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Submit Your Abstract',
};

export default function SubmitAbstractPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <Icons.FileText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">Submit Your Abstract</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share your innovative concept for EcoInvent 2025.
        </p>
      </header>
      <AbstractSubmissionForm />
    </div>
  );
}
