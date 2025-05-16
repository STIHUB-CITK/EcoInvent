
import { CategoryCard } from "@/components/sections/CategoryCard";
import { ideathonCategories, worldEnvironmentDayTheme, siteConfig } from "@/config/site";
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
      <section className="text-center py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
        <p className="mt-8 text-2xl md:text-3xl font-semibold text-primary">
          2025 World Environment Day Theme: <span className="text-accent font-bold">{worldEnvironmentDayTheme}</span>
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/submit-abstract">
              Submit Your Idea <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/guidelines">
              View Guidelines
            </Link>
          </Button>
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

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          Ideathon Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideathonCategories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </section>

      <section className="text-center py-10 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-3xl font-bold mb-4 text-primary">Ready to Innovate?</h2>
        <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto">
          Join us in creating a sustainable future. Your ideas can make a difference.
        </p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/refine-abstract">
            Refine Your Abstract with AI <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
