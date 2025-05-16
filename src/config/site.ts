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
    { href: "/gallery", label: "Gallery" },
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
    imageHint: "fashion sustainability",
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
    imageHint: "plastic solution",
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

// Updated collaborator data
export const collaboratorsData = [
  {
    name: 'STIHUB - CIT Kokrajhar',
    logoSrc: 'https://stihub.cit.ac.in/assets/images/dst-logo-nobg.png.webp',
    hint: 'STIHUB CIT Kokrajhar logo',
    url: 'https://stihub.cit.ac.in/'
  },
  {
    name: 'STPI',
    logoSrc: 'https://stpi.in/themes/stpi/images/logo.png',
    hint: 'STPI logo'
  },
  {
    name: 'SmartEdge',
    logoSrc: 'https://smartedge.work/wp-content/uploads/2020/04/smartedgelogo-big.png',
    hint: 'SmartEdge logo'
  },
  // Removed Startup Assam and EDP Cell Club as per new info, can be re-added if needed.
];

// Data for gallery page - replace with actual past program details and images
export const pastProgramsData = [
  {
    id: '1',
    title: 'EcoInnovate 2024',
    description: 'A look back at the groundbreaking solutions from our 2024 ideathon focusing on urban sustainability and smart cities.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'conference event',
    tags: ['Urban Sustainability', 'Smart Cities', 'Innovation'],
  },
  {
    id: '2',
    title: 'GreenTech Challenge 2023',
    description: 'Highlights from the 2023 challenge where teams developed new technologies for renewable energy sources.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'technology showcase',
    tags: ['Renewable Energy', 'Tech', 'Competition'],
  },
  {
    id: '3',
    title: 'Circular Economy Forum 2022',
    description: 'Exploring circular business models and waste reduction strategies with industry leaders and startups.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'forum discussion',
    tags: ['Circular Economy', 'Waste Reduction', 'Business Models'],
  },
  {
    id: '4',
    title: 'OceanSavers Initiative 2021',
    description: 'Projects aimed at combating plastic pollution in marine environments and protecting ocean biodiversity.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'ocean cleanup',
    tags: ['Marine Conservation', 'Plastic Pollution', 'Biodiversity'],
  },
];
