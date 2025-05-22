import Image from "next/image";
import { CategoryCard } from "@/components/sections/CategoryCard";
import { CollaboratorsSection } from "@/components/sections/CollaboratorsSection";
import {
  ideathonCategories,
  worldEnvironmentDayTheme,
  siteConfig,
} from "@/config/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Revamped Hero Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Innovate for a{" "}
              <span className="text-primary">Greener Future</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground/80 sm:text-xl max-w-xl">
              Join {siteConfig.name}'s 2025 Ideathon. <br /> On the occasion of
              World Environment Day, June 5, 2025, STIHUB at CIT Kokrajhar
              invites young minds to develop innovative, eco-friendly solutions
              for a sustainable future. This initiative aims to spark impactful
              ideas in areas like food, fashion, and tourism- driving change
              through creativity and conscious innovation, primarily focused on
              this year's theme of{" "}
              <span className="font-semibold text-accent">
                {worldEnvironmentDayTheme}
              </span>
              . <br />
              Submit your pioneering ideas and help shape a sustainable world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button
                asChild
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href="/submit-abstract">
                  Submit Your Idea <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href="/guidelines">View Guidelines</Link>
              </Button>
            </div>
          </div>
          {/* Right Column: Image */}
          <div className="hidden md:flex justify-center items-center">
            <Image
              src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Innovative environmental solutions showcase"
              width={500}
              height={500}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="environmental technology innovation"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Explore Our Themes
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
        >
          <CarouselContent>
            {ideathonCategories.map((category, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <CategoryCard category={category} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <CollaboratorsSection />

      <section className="text-center py-16 bg-card rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-3xl font-bold mb-4 text-primary">
          Ready to Innovate?
        </h2>
        <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto">
          Join us in creating a sustainable future. Your ideas can make a
          difference.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow"
        >
          <Link href="/refine-abstract">
            Refine Your Abstract with AI <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
