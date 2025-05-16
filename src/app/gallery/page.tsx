
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { pastProgramsData } from '@/config/site'; // Import data from site config

export const metadata: Metadata = {
  title: 'Gallery - Past Programs | EcoInvent',
  description: 'Showcase of previous EcoInvent ideathons, winning projects, and memorable moments.',
};

export default function GalleryPage() {
  return (
    <div className="space-y-12">
      <header className="text-center py-8">
        <Icons.Images className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">Gallery of Past Programs</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the impact, innovation, and memorable moments from our previous EcoInvent events.
        </p>
      </header>

      {pastProgramsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastProgramsData.map(program => (
            <Card key={program.id} className="flex flex-col group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={program.imageSrc}
                  alt={`${program.title} - Please replace with actual image`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={program.imageHint}
                  className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{program.description}</CardDescription>
              </CardContent>
              {program.tags && program.tags.length > 0 && (
                <CardFooter className="flex flex-wrap gap-2 pt-4">
                  {program.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Icons.HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">Gallery coming soon!</p>
          <p className="text-sm text-muted-foreground">Check back later to see highlights from our past events.</p>
        </div>
      )}
       <p className="text-center text-sm text-muted-foreground mt-12">
        Please note: All images are currently placeholders. Replace them with actual event photos from Unsplash, Pexels, or your own sources.
      </p>
    </div>
  );
}
