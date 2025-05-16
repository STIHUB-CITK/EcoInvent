"use client";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"; // Added SheetTitle
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as React from "react";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label={siteConfig.name}>
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">{siteConfig.name}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 p-0">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">{siteConfig.name}</span>
                  </Link>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="h-6 w-6" />
                     </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-2 p-4">
                  {siteConfig.navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
