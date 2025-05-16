import type { Icon } from "lucide-react";

export const siteConfig = {
  name: "EcoInvent",
  description: "Innovate for a Greener Future. The 2025 Ideathon on Ending Plastic Pollution.",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/guidelines", label: "Guidelines" },
    { href: "/submit-abstract", label: "Submit Abstract" },
    { href: "/shortlisting-info", label: "Shortlisting Info" },
    { href: "/refine-abstract", label: "AI Abstract Refiner" },
  ],
};

export type IdeathonCategory = {
  name: string;
  description: string;
  iconName: keyof typeof import("lucide-react").icons; // For dynamic icon loading
  imageSrc: string;
  imageHint: string;
};

export const ideathonCategories: IdeathonCategory[] = [
  {
    name: "Sustainable Fashion",
    description: "Innovations in eco-friendly clothing, materials, and production processes.",
    iconName: "Shirt",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "sustainable fashion",
  },
  {
    name: "Waste to Wealth",
    description: "Transforming waste materials into valuable resources and products.",
    iconName: "Recycle",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "recycling innovation",
  },
  {
    name: "Sustainable Tourism",
    description: "Promoting eco-conscious travel and tourism practices.",
    iconName: "MapPin",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "eco tourism",
  },
  {
    name: "Sustainable Energy",
    description: "Developing and implementing renewable and efficient energy solutions.",
    iconName: "Lightbulb",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "renewable energy",
  },
  {
    name: "Combating Plastic Pollution",
    description: "Innovative solutions to reduce, reuse, and recycle plastics.",
    iconName: "Trash2",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "plastic pollution solution",
  },
  {
    name: "Circular Business Models",
    description: "Creating regenerative systems where resources are kept in use for as long as possible.",
    iconName: "RefreshCw",
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "circular economy",
  },
];

export const worldEnvironmentDayTheme = "Ending Plastic Pollution";
