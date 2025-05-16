import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post-Shortlisting Steps',
};

const shortlistingSteps = [
  {
    id: "step1",
    title: "Execution Plan Submission",
    iconName: "Rocket",
    description: "Detail your project's roadmap, milestones, and resource allocation.",
    content: [
      "Provide a comprehensive timeline for project development and implementation.",
      "Outline key milestones and deliverables for each phase.",
      "Specify the resources (human, financial, technical) required.",
      "Address potential challenges and mitigation strategies.",
    ],
  },
  {
    id: "step2",
    title: "Business Model Description",
    iconName: "Briefcase",
    description: "Elaborate on the financial viability and sustainability of your concept.",
    content: [
      "Define your target market and value proposition.",
      "Explain your revenue streams and cost structure.",
      "Describe your marketing and sales strategy.",
      "Analyze the competitive landscape and your unique selling points.",
    ],
  },
  {
    id: "step3",
    title: "Business Concept Document",
    iconName: "FileText",
    description: "Submit a consolidated document detailing your business concept.",
    content: [
      "This document should synthesize your execution plan and business model.",
      "Include market research, team capabilities, and scalability plans.",
      "Focus on demonstrating long-term sustainability and impact.",
      "The document should be well-structured and professionally presented.",
    ],
  },
];

export default function ShortlistingInfoPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Icons.ClipboardCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">After Shortlisting: Next Steps</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Congratulations on being shortlisted! Here's what you need to prepare next.
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {shortlistingSteps.map((step) => {
          const IconComponent = Icons[step.iconName as keyof typeof Icons || "HelpCircle"];
          return (
            <AccordionItem value={step.id} key={step.id} className="border bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-7 w-7 text-primary" />
                  <span>{step.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  {step.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Card className="mt-8 bg-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <Icons.Sparkles className="h-8 w-8 text-primary mr-3" />
            Pro Tip!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary/90">
            Start preparing these documents early. Thoroughness and clarity will be key for the final evaluation.
            Focus on demonstrating the scalability and real-world impact of your solution. Good luck!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
