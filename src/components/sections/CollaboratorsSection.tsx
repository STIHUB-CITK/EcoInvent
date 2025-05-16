
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { collaboratorsData } from '@/config/site'; // Import data from site config

export function CollaboratorsSection() {
  if (!collaboratorsData || collaboratorsData.length === 0) {
    return null; // Don't render section if no collaborators
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary flex items-center justify-center">
          <Icons.Handshake className="h-10 w-10 mr-4 text-primary" />
          Our Valued Collaborators
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 md:gap-x-12 lg:gap-x-16">
          {collaboratorsData.map(collaborator => (
            <div key={collaborator.name} className="p-2 group" title={collaborator.name}>
              <div className="relative h-16 w-40 sm:h-20 sm:w-48 transition-transform duration-300 ease-in-out group-hover:scale-105">
                <Image
                  src={collaborator.logoSrc}
                  alt={`${collaborator.name} logo - Please replace with actual image`}
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint={collaborator.hint}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-muted-foreground">
          We are grateful for the support of organizations committed to a sustainable future.
        </p>
      </div>
    </section>
  );
}
