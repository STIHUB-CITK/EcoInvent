import { CategoryCard } from "@/components/sections/CategoryCard";
import { ideathonCategories, worldEnvironmentDayTheme, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-lg shadow-inner">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
        <p className="mt-6 text-2xl font-semibold text-accent-foreground">
          2025 World Environment Day Theme: <span className="text-accent">{worldEnvironmentDayTheme}</span>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
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
