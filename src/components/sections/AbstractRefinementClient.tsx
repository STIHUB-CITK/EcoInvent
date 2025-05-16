"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";

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
import { Input } from "@/components/ui/input"; // Not used here directly, but good to have.
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { handleAbstractRefinement } from "@/app/refine-abstract/actions";
import type { AbstractRefinementOutput } from "@/ai/flows/abstract-refinement";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const refinementFormSchema = z.object({
  abstractText: z.string().min(50, { message: "Abstract text must be at least 50 characters." }).max(5000, { message: "Abstract text must be at most 5000 characters."}),
  ideathonCategory: z.string({ required_error: "Please select an Ideathon category." }),
  currentEnvironmentalTrends: z.string().min(20, { message: "Please describe current environmental trends (min 20 characters)." }).max(2000, { message: "Trend description must be at most 2000 characters."}),
  successfulSubmissionExamples: z.string().min(20, { message: "Please provide some examples of successful submissions (min 20 characters)." }).max(2000, { message: "Examples must be at most 2000 characters."}),
});

type RefinementFormValues = z.infer<typeof refinementFormSchema>;

interface AbstractRefinementClientProps {
  categories: { value: string; label: string }[];
}

export function AbstractRefinementClient({ categories }: AbstractRefinementClientProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AbstractRefinementOutput | null>(null);

  const form = useForm<RefinementFormValues>({
    resolver: zodResolver(refinementFormSchema),
    defaultValues: {
      abstractText: "",
      ideathonCategory: undefined,
      currentEnvironmentalTrends: "Example: Growing focus on biodegradable plastics, circular economy models, and community-led waste management initiatives.",
      successfulSubmissionExamples: "Example: A project that developed a low-cost water filter from local materials, or an app that gamified recycling for students.",
    },
    mode: "onChange",
  });

  async function onSubmit(data: RefinementFormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleAbstractRefinement(data);
      if (response.success && response.data) {
        setResult(response.data);
        toast({
          title: "Abstract Refined!",
          description: "Suggestions have been generated successfully.",
        });
      } else {
        toast({
          title: "Error Refining Abstract",
          description: response.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Refine Your Abstract</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="abstractText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Abstract Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your abstract here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ideathonCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ideathon Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentEnvironmentalTrends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Environmental Trends</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe relevant current environmental trends..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    E.g., focus on circular economy, microplastic reduction, community-based solutions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="successfulSubmissionExamples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Examples of Successful Submissions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide brief examples of successful past submissions or similar ideas..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    E.g., Project X that achieved Y, Idea Z focusing on A.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refining...
                </>
              ) : (
                <>
                  <Icons.Sparkles className="mr-2 h-5 w-5" /> Refine Abstract
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      {result && (
        <CardFooter className="flex-col items-start gap-4 pt-6 mt-6 border-t">
            <h3 className="text-2xl font-semibold text-primary">Refinement Results</h3>
            
            <Card className="w-full bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary/90">Suggested Refined Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap">{result.refinedAbstract}</p>
              </CardContent>
            </Card>

            <Card className="w-full bg-accent/5">
              <CardHeader>
                <CardTitle className="text-xl text-accent-foreground/90">Specific Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
        </CardFooter>
      )}
    </Card>
  );
}
