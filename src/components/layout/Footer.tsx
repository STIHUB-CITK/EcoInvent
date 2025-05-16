import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-right">
          Innovate for a Greener Future.
        </p>
      </div>
    </footer>
  );
}
