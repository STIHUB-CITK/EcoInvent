import Image from "next/image";
import type { IdeathonCategory } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/icons"; // Centralized icons

type CategoryCardProps = {
  category: IdeathonCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = Icons[category.iconName] || Icons.HelpCircle;

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-8 w-8 text-primary" />
          <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
        </div>
      </CardHeader>
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={category.imageSrc}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={category.imageHint}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-muted-foreground">
          {category.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
