import type { Metadata } from 'next';
import { AbstractRefinementClient } from '@/components/sections/AbstractRefinementClient';
import { ideathonCategories } from '@/config/site';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: 'AI Abstract Refiner',
};

export default function RefineAbstractPage() {
  const categoryOptions = ideathonCategories.map(cat => ({ value: cat.name, label: cat.name }));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center">
        <Icons.Brain className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">AI Abstract Refiner</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get AI-powered suggestions to improve your abstract based on successful submissions and current environmental trends.
        </p>
      </header>
      <AbstractRefinementClient categories={categoryOptions} />
    </div>
  );
}
