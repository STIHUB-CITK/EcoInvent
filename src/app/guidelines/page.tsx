import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Participation Guidelines',
};

const guidelines = [
  {
    title: "Team Formation",
    icon: "Users",
    points: [
      "Participants can form teams of up to 4 members.",
      "Solo participants are also welcome to register and submit their ideas.",
      "Inter-disciplinary teams are encouraged to foster diverse perspectives.",
    ],
  },
  {
    title: "Abstract Submission",
    icon: "FileText",
    points: [
      "Submit a concise abstract of your concept (max 500 words).",
      "Include objectives, potential hardware/software requirements, and technical applications.",
      "A minimum of 5 presentation slides outlining the idea must be linked.",
      "Focus on innovation, feasibility, and impact related to the theme 'Ending Plastic Pollution'.",
    ],
  },
  {
    title: "Evaluation Criteria",
    icon: "ClipboardList",
    points: [
      "Innovation and Originality: Uniqueness and creativity of the idea.",
      "Feasibility: Practicality of implementing the solution.",
      "Impact: Potential to address plastic pollution and promote sustainability.",
      "Clarity: Clear presentation of the concept and objectives.",
      "Alignment with Theme: Relevance to 'Ending Plastic Pollution'.",
    ],
  },
  {
    title: "Timeline & Key Dates",
    icon: "CalendarDays", // Placeholder, CalendarDays is not in Icons. Assuming HelpCircle for now.
    points: [
      "Registration Opens: [Date]",
      "Abstract Submission Deadline: [Date]",
      "Shortlist Announcement: [Date]",
      "Final Submission (Execution Plan, etc.): [Date]",
      "Ideathon Finale & Winner Announcement: [Date]",
    ],
  },
];

export default function GuidelinesPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary">Participation Guidelines</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Everything you need to know to participate in EcoInvent 2025.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {guidelines.map((section) => {
          const IconComponent = Icons[section.icon as keyof typeof Icons || "HelpCircle"];
          return (
            <Card key={section.title} className="shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-3">
                <IconComponent className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  {section.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
       <Card className="mt-8 bg-accent/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-accent-foreground flex items-center">
            <Icons.Sparkles className="h-8 w-8 text-accent mr-3" />
            Important Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-accent-foreground/90">
            All submissions must be original work. Plagiarism will lead to disqualification.
            Ensure your project aligns with ethical considerations and promotes sustainability.
            We look forward to your innovative solutions!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
