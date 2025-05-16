"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const submissionFormSchema = z.object({
  teamName: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  participantNames: z.string().min(10, { message: "Please list participant names." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  concept: z.string().min(50, { message: "Concept description must be at least 50 characters." }).max(1000, { message: "Concept description must be at most 1000 characters." }),
  objective: z.string().min(30, { message: "Objective must be at least 30 characters." }).max(500, { message: "Objective must be at most 500 characters." }),
  requirements: z.string().min(10, { message: "Please describe requirements."}).max(500, {message: "Requirements description must be at most 500 characters."}),
  technicalApplications: z.string().min(20, { message: "Technical applications must be at least 20 characters." }).max(500, {message: "Technical applications must be at most 500 characters."}),
  slidesLink: z.string().url({ message: "Please enter a valid URL for your presentation slides." }),
});

type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

const defaultValues: Partial<SubmissionFormValues> = {
  teamName: "",
  participantNames: "",
  email: "",
  concept: "",
  objective: "",
  requirements: "",
  technicalApplications: "",
  slidesLink: "",
};

export function AbstractSubmissionForm() {
  const { toast } = useToast();
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: SubmissionFormValues) {
    // Here you would typically send the data to your backend (e.g., SQLite via a server action)
    // For now, we'll just simulate a successful submission.
    console.log(data);
    toast({
      title: "Submission Received!",
      description: "Your abstract has been successfully submitted. We will review it and get back to you.",
      variant: "default", // 'default' variant should use primary color for accents
    });
    form.reset(); // Reset form after submission
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Submission Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Eco Warriors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participantNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participant Names</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List all participant names, one per line."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Full names of all team members.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Primary contact email for your team.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concept</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your innovative concept in detail (max 1000 characters)."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are the main objectives of your project? (max 500 characters)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hardware/Software Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any specific hardware or software needed (max 500 characters)."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technicalApplications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Applications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the technical aspects and applications of your project (max 500 characters)."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slidesLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentation Slides Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://link.to/your/slides (e.g., Google Slides, OneDrive)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Link to your presentation (minimum 5 slides). Ensure it's publicly accessible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Icons.RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Icons.Send className="mr-2 h-5 w-5" /> Submit Abstract
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
